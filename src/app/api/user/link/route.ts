import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, auth_user_id } = await request.json();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    if (!email || !auth_user_id) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Buscar si existe un cliente con ese email pero que no tenga auth_user_id
    const { data: existingClient } = await supabaseAdmin
      .from('clientes')
      .select('id, auth_user_id')
      .eq('email', email)
      .limit(1)
      .single();

    if (existingClient) {
      // Vincularlo o actualizar el auth_user_id si la cuenta fue recreada
      await supabaseAdmin
        .from('clientes')
        .update({ auth_user_id: auth_user_id })
        .eq('id', existingClient.id);
        
      return NextResponse.json({ success: true, linked: true });
    }

    return NextResponse.json({ success: true, linked: false });

  } catch (error: any) {
    console.error("Error linking account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
