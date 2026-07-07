import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { auth_user_id } = await request.json();
    
    if (!auth_user_id) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }
    
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }
    
    // Fetch bypassing RLS
    const { data: clientData, error } = await supabaseAdmin
      .from('clientes')
      .select('*, mascotas(*, citas(*))')
      .eq('auth_user_id', auth_user_id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching client bypass RLS:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ clientData });
  } catch (error: any) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

