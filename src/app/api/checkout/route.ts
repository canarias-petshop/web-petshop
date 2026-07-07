import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      items, cliente, telefono, direccion, notas, 
      metodo_pago, metodo_entrega, auth_user_id, email, cliente_id,
      puntos_usados, descuento_puntos, puntos_ganados, descuento_primera_compra, total_original, coste_envio, zona_envio, total_final 
    } = body;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

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
      const { data: existingClients } = await supabaseAdmin
        .from('clientes')
        .select('id, puntos, direccion')
        .eq('telefono', telefono)
        .limit(1);
        
      if (existingClients && existingClients.length > 0) {
        id_cliente = existingClients[0].id;
        nuevo_saldo_puntos = (existingClients[0].puntos || 0); // No descontamos puntos aún, se hace al confirmar en TPV
        
        // Si hay dirección en el checkout, la actualizamos en el cliente
        // También vinculamos el email y auth_user_id si la ficha antigua no lo tenía
        const updatePayload: any = {};
        if (direccion && direccion.trim() !== "") updatePayload.direccion = direccion;
        if (email) updatePayload.email = email;
        if (auth_user_id) updatePayload.auth_user_id = auth_user_id;

        if (Object.keys(updatePayload).length > 0) {
           await supabaseAdmin.from('clientes').update(updatePayload).eq('id', id_cliente);
        }
      } else {
        const { data: newClient } = await supabaseAdmin.from('clientes').insert({
          nombre_dueno: cliente,
          telefono: telefono,
          email: email || '',
          auth_user_id: auth_user_id || null,
          direccion: direccion || '',
          metodo_contacto: 'WhatsApp',
          puntos: 0, // Se sumarán al confirmar en TPV
          servicio_domicilio: metodo_entrega === 'Envío a domicilio',
          rgpd_consent: false
        }).select('id').single();
        if (newClient) {
          id_cliente = newClient.id;
        }
      }
    } else if (id_cliente) {
      // Cliente logueado
      const { data: cliInfo } = await supabaseAdmin.from('clientes').select('puntos').eq('id', id_cliente).single();
      const puntos_actuales = cliInfo?.puntos || 0;
      nuevo_saldo_puntos = puntos_actuales; // No descontamos aún
      
      // Actualizar dirección si la puso en checkout
      if (direccion && direccion.trim() !== "") {
          await supabaseAdmin.from('clientes').update({ direccion: direccion }).eq('id', id_cliente);
      }
    }

    // 2. Preparar los datos técnicos para el TPV
    const metadata = {
      items: productosParaVenta,
      puntos_usados: puntos_usados || 0,
      puntos_ganados: puntos_ganados || 0,
      descuento_primera_compra: descuento_primera_compra || 0,
      coste_envio: coste_envio || 0,
      metodo_pago: metodo_pago,
      total_final: total_final,
      direccion: direccion || '',
      metodo_entrega: metodo_entrega,
      cliente_id: id_cliente
    };
    
    let notasLimpias = notas || `Pedido Web - Pago: ${metodo_pago}`;
    if (descuento_primera_compra && descuento_primera_compra > 0) {
      notasLimpias += `\n* Dto. Primera Compra Aplicado (-${descuento_primera_compra.toFixed(2)}€)`;
    }
    
    const prefijo = metodo_entrega === 'Envío a domicilio' ? `[DOMICILIO]` : `[RECOGIDA TIENDA]`;
    const notasConMetadatos = `${prefijo} ${notasLimpias}\n[---METADATA---]${JSON.stringify(metadata)}[---/METADATA---]`;

    // 3. Crear el Encargo en la base de datos (con auth_user_id para el descuento)
    const detalle_pedido = items.map((i: any) => `${i.cantidad}x ${i.nombre}`).join(' + ');
    
    const { data: newOrder, error } = await supabaseAdmin.from('encargos_clientes').insert({
      nombre_cliente: cliente,
      telefono: telefono || '',
      detalle_pedido: detalle_pedido,
      notas: notasConMetadatos,
      estado: 'Recibido',
      origen: 'Web',
      auth_user_id: auth_user_id || null
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
