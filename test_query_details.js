const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');
async function test() {
  const { data, error } = await supabase.from('clientes').select('*, mascotas(*, citas(*))').eq('auth_user_id', 'd13ca3c9-c70f-46d6-9a07-b5b9b32b36ba').single();
  console.log('DATA:', JSON.stringify(data));
  console.log('ERROR:', JSON.stringify(error));
}
test();
