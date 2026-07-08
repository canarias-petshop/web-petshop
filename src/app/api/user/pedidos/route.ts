import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { telefono } = await request.json();
    
    if (!telefono) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }
    
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }
    
    // Fetch bypassing RLS
    const { data: pedidos, error } = await supabaseAdmin
      .from('encargos_clientes')
      .select('*')
      .eq('telefono', telefono)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching pedidos bypass RLS:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ pedidos });
  } catch (error: any) {
    console.error('Pedidos API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
