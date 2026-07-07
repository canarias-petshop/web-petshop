import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { processRestNotification } from '@/lib/redsys';

export async function POST(request: Request) {
  try {
    // Redsys suele enviar los datos codificados en x-www-form-urlencoded
    const textBody = await request.text();
    const params = new URLSearchParams(textBody);

    const version = params.get('Ds_SignatureVersion');
    const merchantParams = params.get('Ds_MerchantParameters');
    const signature = params.get('Ds_Signature');

    if (!version || !merchantParams || !signature) {
      return NextResponse.json({ error: 'Faltan parámetros de Redsys' }, { status: 400 });
    }

    // Verificar firma y decodificar parámetros
    const decoded = processRestNotification({
      Ds_SignatureVersion: version,
      Ds_MerchantParameters: merchantParams,
      Ds_Signature: signature
    });

    const responseCode = parseInt(String(decoded.response), 10);
    const isApproved = responseCode >= 0 && responseCode <= 99;

    if (!isApproved) {
      console.error('Pago denegado por Redsys. Ds_Response:', decoded.response);
      return NextResponse.json({ status: 'Pago denegado' }, { status: 200 });
    }

    // Extraer el ID original del pedido. 
    // Recuerda que lo generamos como: id.toString().padStart(4, '0') + 6 chars de timestamp
    const dsOrder = decoded.order || '';
    const originalIdStr = dsOrder.slice(0, -6);
    const orderId = parseInt(originalIdStr, 10);

    if (isNaN(orderId)) {
      console.error('Error parseando orderId de Ds_Order:', dsOrder);
      return NextResponse.json({ error: 'Order ID inválido' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    // Obtener pedido actual para saber si es Domicilio o Recogida local
    const { data: order, error: orderError } = await supabaseAdmin
      .from('encargos_clientes')
      .select('estado, notas, nombre_cliente, telefono, detalle_pedido')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Pedido no encontrado en webhook:', orderId);
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Determinar nuevo estado
    let nuevoEstado = 'Confirmado con recogida local';
    if (order.notas && order.notas.includes('[DOMICILIO]')) {
      nuevoEstado = 'Confirmado con reparto a domicilio';
    }

    // Intentar leer la metadata del carrito
    const notas = order.notas || '';
    let meta: any = null;
    if (notas.includes('[---METADATA---]')) {
      const metaStr = notas.split('[---METADATA---]')[1].split('[---/METADATA---]')[0];
      try { meta = JSON.parse(metaStr); } catch (e) { console.error('Error parseando metadata', e); }
    }

    if (meta) {
      const total = meta.total_final || 0;
      
      // 1. Calcular Hash para ventas_historial
      const { data: lastHashData } = await supabaseAdmin
        .from('ventas_historial')
        .select('hash_actual')
        .order('id', { ascending: false })
        .limit(1);
      
      const hashAnt = (lastHashData && lastHashData.length > 0) ? lastHashData[0].hash_actual : "GENESIS";
      const now = new Date();
      const dateISO = now.toISOString();
      const formatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'Atlantic/Canary', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const fechaStr = formatter.format(now).replace(',', '');
      
      const crypto = require('crypto');
      const strData = `${dateISO}-${total}-${hashAnt}`;
      const hashAct = crypto.createHash('sha256').update(strData).digest('hex');
      
      // 2. Insertar en ventas_historial
      const descuentoPrimera = meta.descuento_primera_compra || 0;
      await supabaseAdmin.from('ventas_historial').insert({
          fecha: fechaStr,
          productos: meta.items || [],
          total: total,
          pagado: total,
          pendiente: 0,
          metodo_pago: `Tarjeta (WEB/REDSYS)`,
          cliente_deuda: "",
          puntos_ganados: meta.puntos_ganados || 0,
          puntos_usados: meta.puntos_usados || 0,
          descuento_global: descuentoPrimera,
          hash_anterior: hashAnt,
          hash_actual: hashAct,
          estado: "Completado",
          cliente_vip_nombre: order.nombre_cliente || ""
      });
      
      // 3. Descontar Stock
      for (const item of (meta.items || [])) {
          if (item.id !== 'ENVIO') {
              const { data: prodData } = await supabaseAdmin.from('productos').select('stock_actual').eq('id', item.id).single();
              if (prodData) {
                  const nStock = (prodData.stock_actual || 0) - (item.cantidad || 1);
                  await supabaseAdmin.from('productos').update({ stock_actual: nStock }).eq('id', item.id);
              }
          }
      }
      
      // 4. Sumar Puntos
      if (meta.cliente_id) {
          const { data: cliData } = await supabaseAdmin.from('clientes').select('puntos').eq('id', meta.cliente_id).single();
          if (cliData) {
              const pts = cliData.puntos || 0;
              const nuevoSaldo = pts - (meta.puntos_usados || 0) + (meta.puntos_ganados || 0);
              await supabaseAdmin.from('clientes').update({ puntos: nuevoSaldo }).eq('id', meta.cliente_id);
          }
      }
      
      // 5. Crear Servicio a Domicilio
      if (nuevoEstado === 'Confirmado con reparto a domicilio') {
          await supabaseAdmin.from('pedidos_domicilio').insert({
              nombre_cliente: order.nombre_cliente || "",
              telefono: order.telefono || "",
              direccion: meta.direccion || "",
              detalle_pedido: order.detalle_pedido || "",
              estado: "Pendiente",
              notas: `Pedido Web Redsys Pagado - Total: ${total.toFixed(2)}€`
          });
      }
    }

    // Actualizar estado en Supabase
    const { error: updateError } = await supabaseAdmin
      .from('encargos_clientes')
      .update({ estado: nuevoEstado })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error actualizando pedido tras pago:', updateError);
      return NextResponse.json({ error: 'Error BD' }, { status: 500 });
    }

    // Redsys espera un 200 OK
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error: any) {
    console.error('Error procesando webhook de redsys:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
