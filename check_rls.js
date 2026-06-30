const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('', ''); // Service Role Key
async function test() {
  const { data, error } = await supabase.from('clientes').select('*').limit(1);
  console.log('Query with Service Role:', error ? error : 'OK');
}
test();
