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
      .select('estado, notas')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Pedido no encontrado en webhook:', orderId);
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Determinar nuevo estado
    let nuevoEstado = 'Confirmado (Recogida local)';
    if (order.notas && order.notas.includes('[RECOGIDA TIENDA]')) {
      nuevoEstado = 'Confirmado (Recogida local)';
    } else if (order.notas && order.notas.includes('[ENVÍO DOMICILIO]')) {
      nuevoEstado = 'Confirmado (Domicilio)';
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
