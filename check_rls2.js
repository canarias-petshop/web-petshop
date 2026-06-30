const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('', ''); // Service Role Key
async function test() {
  const { data, error } = await supabase.from('pg_policies').select('*').eq('tablename', 'clientes');
  console.log('Policies:', JSON.stringify(data, null, 2));
}
test();
