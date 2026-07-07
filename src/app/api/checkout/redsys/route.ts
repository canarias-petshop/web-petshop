import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createRedirectForm, redsysMerchantCode, redsysTerminal } from '@/lib/redsys';

function extractMetadata(notas: string) {
  if (!notas) return null;
  const match = notas.match(/\[---METADATA---\]([\s\S]*?)\[---\/METADATA---\]/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID es requerido' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 });
    }

    // Obtener pedido de la BD
    const { data: order, error } = await supabaseAdmin
      .from('encargos_clientes')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const meta = extractMetadata(order.notas || '');
    if (!meta || typeof meta.total_final === 'undefined') {
      return NextResponse.json({ error: 'El pedido no tiene un total válido para cobrar' }, { status: 400 });
    }

    // Convertir el total a string con dos decimales para el formatter de redsys-easy
    const totalAmount = Number(meta.total_final).toFixed(2);

    // Generar el identificador de orden para Redsys (máximo 12 caracteres alfanuméricos, primeros 4 deben ser números)
    // Usamos el ID del pedido y lo rellenamos con ceros para asegurar que tiene al menos 4 dígitos.
    // Además le añadimos un timestamp corto para evitar duplicados si el cliente reintenta el pago.
    const orderNumberStr = order.id.toString().padStart(4, '0') + Date.now().toString().slice(-6);

    const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://animalariumtenerife.es';
    const merchantURL = `${domain}/api/webhook/redsys`; 
    const urlOK = `${domain}/ticket/${order.id}?status=success`;
    const urlKO = `${domain}/pago/${order.id}?status=error`;

    const form = createRedirectForm({
      merchantCode: redsysMerchantCode,
      terminal: redsysTerminal,
      transactionType: '0', 
      order: orderNumberStr,
      amount: totalAmount,
      currency: 'EUR',
      merchantURL: merchantURL,
      successURL: urlOK,
      errorURL: urlKO,
      merchantName: 'Animalarium',
      payMethods: 'C', // T=Tarjeta, z=Bizum, C=Ambas. Permitimos elegir en la propia pasarela si quieren
    });

    return NextResponse.json(form);
  } catch (error: any) {
    console.error('Error generating redsys form:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
