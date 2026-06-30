import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

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

    // 1. Obtener Hash Anterior para ventas_historial (Ley Antifraude)
    const { data: lastHash } = await supabase
      .from('ventas_historial')
      .select('hash_actual')
      .order('id', { ascending: false })
      .limit(1)
      .single();
      
    const hash_anterior = lastHash?.hash_actual || "GENESIS";
    const fecha = new Date();
    
    // Formatear items para ventas_historial
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

    const str_data = `${fecha.toISOString()}-${total_final}-${hash_anterior}`;
    const hash_actual = crypto.createHash('sha256').update(str_data).digest('hex');

    // 2. Resolver Cliente y Puntos
    let id_cliente = cliente_id;
    let nuevo_saldo_puntos = 0;
    
    // Si no está logueado pero dejó teléfono, buscar o crear cliente
    if (!id_cliente && telefono) {
      const { data: existingClients } = await supabase
        .from('clientes')
        .select('id, puntos')
        .eq('telefono', telefono)
        .limit(1);
        
      if (existingClients && existingClients.length > 0) {
        id_cliente = existingClients[0].id;
        nuevo_saldo_puntos = (existingClients[0].puntos || 0) - (puntos_usados || 0) + (puntos_ganados || 0);
      } else {
        const { data: newClient } = await supabase.from('clientes').insert({
          nombre_dueno: cliente,
          telefono: telefono,
          direccion: direccion || '',
          metodo_contacto: 'WhatsApp',
          puntos: puntos_ganados,
          servicio_domicilio: metodo_entrega === 'Envío a domicilio'
        }).select('id').single();
        if (newClient) {
          id_cliente = newClient.id;
          nuevo_saldo_puntos = puntos_ganados;
        }
      }
    } else if (id_cliente) {
      // Cliente logueado
      const { data: cliInfo } = await supabase.from('clientes').select('puntos').eq('id', id_cliente).single();
      const puntos_actuales = cliInfo?.puntos || 0;
      nuevo_saldo_puntos = puntos_actuales - (puntos_usados || 0) + (puntos_ganados || 0);
    }

    // Actualizar puntos del cliente
    if (id_cliente) {
      await supabase.from('clientes').update({ puntos: nuevo_saldo_puntos }).eq('id', id_cliente);
    }

    // 3. Registrar Venta en Historial
    const metodoLog = `${metodo_pago} (WEB)`;
    
    // Como el pago se hace a posteriori, se guarda como deuda
    const estadoVenta = 'Deuda';
    const pendiente = total_final;
    const pagado = 0;

    const { error: errorVenta } = await supabase
      .from('ventas_historial')
      .insert({
        fecha: fecha.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
        productos: productosParaVenta,
        total: total_final,
        pagado: pagado,
        pendiente: pendiente,
        metodo_pago: metodoLog, // Asumiendo que usa esta columna
        metodo: metodoLog, // Por si usa esta
        cliente_fidel: cliente,
        cliente_deuda: cliente, // Asignamos la deuda al cliente
        puntos_ganados: puntos_ganados || 0,
        puntos_usados: puntos_usados || 0,
        puntos_descontados: puntos_usados || 0,
        nuevo_saldo: nuevo_saldo_puntos,
        descuento_global: 0,
        hash_anterior: hash_anterior,
        hash_actual: hash_actual,
        estado: estadoVenta,
        empleado: 'WEB'
      });

    if (errorVenta) {
      console.error("Error insertando venta:", errorVenta);
    }

    // 4. Crear el pedido para logística (reparto o recogida)
    const detalle_pedido = items.map((i: any) => `${i.cantidad}x ${i.nombre}`).join(' + ');
    let notasFinales = notas || `Pedido Web - Pago: ${metodo_pago}`;
    
    if (metodo_entrega === 'Envío a domicilio') {
      await supabase.from('pedidos_domicilio').insert({
        nombre_cliente: cliente,
        telefono: telefono || '',
        direccion: direccion,
        detalle_pedido: detalle_pedido,
        estado: 'Pendiente',
        notas: notasFinales
      });
    } else {
      await supabase.from('encargos_clientes').insert({
        nombre_cliente: cliente,
        telefono: telefono || '',
        detalle_pedido: detalle_pedido,
        notas: `RECOGIDA EN TIENDA | ${notasFinales}`,
        estado: 'Pendiente',
        origen: 'Web'
      });
    }

    // 5. Descontar Stock
    for (const item of items) {
      if (item.id) {
        const { data: prodData } = await supabase.from('productos').select('stock_actual').eq('id', item.id).single();
        if (prodData) {
          const newStock = (prodData.stock_actual || 0) - item.cantidad;
          await supabase.from('productos').update({ stock_actual: newStock }).eq('id', item.id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
