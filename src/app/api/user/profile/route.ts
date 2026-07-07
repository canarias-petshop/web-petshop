import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const user = session.user;
    
    // Fetch bypassing RLS
    const { data: clientData, error } = await supabaseAdmin
      .from('clientes')
      .select('*, mascotas(*, citas(*))')
      .eq('auth_user_id', user.id)
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

