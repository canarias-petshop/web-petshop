import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      items, cliente, telefono, direccion, notas, 
      metodo_pago, metodo_entrega, auth_user_id, cliente_id,
      puntos_usados, descuento_puntos, puntos_ganados, total_original, coste_envio, zona_envio, total_final 
    } = body;

    if (!items || !items.length || !cliente) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Formatear items para ventas_historial posterior en TPV
    const productosParaVenta = items.map((i: any) => ({
      id: i.id,
      nombre: i.nombre,
      precio: i.precio,
      cantidad: i.cantidad,
      sku: i.sku || '',
      igic: i.igic_tipo || '0%'
    }));

    if (coste_envio && coste_envio > 0) {
      productosParaVenta.push({
        id: 'ENVIO',
        nombre: `Gastos de Envío (${zona_envio === 'cercania' ? 'Cercanía' : 'Larga Distancia'})`,
        precio: coste_envio,
        cantidad: 1,
        sku: 'ENVIO',
        igic: '7%'
      });
    }

    // 1. Resolver Cliente y Puntos / Dirección
    let id_cliente = cliente_id;
    let nuevo_saldo_puntos = 0;
    
    // Si no está logueado pero dejó teléfono, buscar o crear cliente
    if (!id_cliente && telefono) {
      const { data: existingClients } = await supabase
        .from('clientes')
        .select('id, puntos, direccion')
        .eq('telefono', telefono)
        .limit(1);
        
      if (existingClients && existingClients.length > 0) {
        id_cliente = existingClients[0].id;
        nuevo_saldo_puntos = (existingClients[0].puntos || 0); // No descontamos puntos aún, se hace al confirmar en TPV
        
        // Si hay dirección en el checkout, la actualizamos en el cliente
        if (direccion && direccion.trim() !== "") {
           await supabase.from('clientes').update({ direccion: direccion }).eq('id', id_cliente);
        }
      } else {
        const { data: newClient } = await supabase.from('clientes').insert({
          nombre_dueno: cliente,
          telefono: telefono,
          direccion: direccion || '',
          metodo_contacto: 'WhatsApp',
          puntos: 0, // Se sumarán al confirmar en TPV
          servicio_domicilio: metodo_entrega === 'Envío a domicilio'
        }).select('id').single();
        if (newClient) {
          id_cliente = newClient.id;
        }
      }
    } else if (id_cliente) {
      // Cliente logueado
      const { data: cliInfo } = await supabase.from('clientes').select('puntos').eq('id', id_cliente).single();
      const puntos_actuales = cliInfo?.puntos || 0;
      nuevo_saldo_puntos = puntos_actuales; // No descontamos aún
      
      // Actualizar dirección si la puso en checkout
      if (direccion && direccion.trim() !== "") {
          await supabase.from('clientes').update({ direccion: direccion }).eq('id', id_cliente);
      }
    }

    // 2. Preparar los datos técnicos para el TPV
    const metadata = {
      items: productosParaVenta,
      puntos_usados: puntos_usados || 0,
      puntos_ganados: puntos_ganados || 0,
      coste_envio: coste_envio || 0,
      metodo_pago: metodo_pago,
      total_final: total_final,
      direccion: direccion || '',
      metodo_entrega: metodo_entrega,
      cliente_id: id_cliente
    };
    
    const notasLimpias = notas || `Pedido Web - Pago: ${metodo_pago}`;
    const prefijo = metodo_entrega === 'Envío a domicilio' ? `[DOMICILIO]` : `[RECOGIDA TIENDA]`;
    const notasConMetadatos = `${prefijo} ${notasLimpias}\n[---METADATA---]${JSON.stringify(metadata)}[---/METADATA---]`;

    // 3. Crear el encargo web en TPV
    const detalle_pedido = items.map((i: any) => `${i.cantidad}x ${i.nombre}`).join(' + ');
    
    await supabase.from('encargos_clientes').insert({
      nombre_cliente: cliente,
      telefono: telefono || '',
      detalle_pedido: detalle_pedido,
      notas: notasConMetadatos,
      estado: 'Recibido',
      origen: 'Web'
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
