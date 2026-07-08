import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { auth_user_id, telefono, nombre_dueno, direccion } = await request.json();

    if (!auth_user_id) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    // Actualizamos el perfil saltándonos el RLS (ya que el usuario autenticado está pidiéndolo)
    const { data, error } = await supabaseAdmin
      .from('clientes')
      .update({
        telefono: telefono || null,
        nombre_dueno: nombre_dueno || null,
        direccion: direccion || null
      })
      .eq('auth_user_id', auth_user_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, clientData: data });

  } catch (error: any) {
    console.error('Update Profile API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
