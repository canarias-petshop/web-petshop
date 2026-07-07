import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase.from('encargos_clientes').select('id, nombre_cliente, estado, origen').ilike('nombre_cliente', '%elida%');
  console.log("Nelida:", data);
}
run();
