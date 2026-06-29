import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, cliente, telefono, direccion, notas } = body;

    if (!items || !items.length || !cliente) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Formatear el pedido
    const detalle_pedido = items.map((i: { cantidad: number, nombre: string }) => `${i.cantidad}x ${i.nombre}`).join(' + ');
    
    let notasFinales = notas || 'Pedido Online';
    if (direccion) {
        notasFinales = `Dirección de Entrega: ${direccion} | ` + notasFinales;
    }

    // Verificar si el cliente existe por teléfono o nombre
    if (telefono) {
      const { data: existingClients } = await supabase
        .from('clientes')
        .select('id')
        .eq('telefono', telefono)
        .limit(1);
        
      if (!existingClients || existingClients.length === 0) {
        // Registrar al cliente
        await supabase.from('clientes').insert({
          nombre_dueno: cliente,
          telefono: telefono,
          direccion: direccion || '',
          metodo_contacto: 'WhatsApp',
          puntos: 0,
          servicio_domicilio: direccion ? true : false
        });
      }
    }

    // Insertar en Supabase
    const { error } = await supabase
      .from('encargos_clientes')
      .insert({
        nombre_cliente: cliente,
        telefono: telefono || '',
        detalle_pedido: detalle_pedido,
        notas: notasFinales,
        estado: 'Pendiente',
        origen: 'Web'
      });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: 'Error al guardar el pedido' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
