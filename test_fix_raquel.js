const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');

async function test() {
  const { data, error } = await supabase.from('clientes').update({ puntos: 6 }).eq('id', '55ef828c-d54a-428a-9332-d271a42b1317').select();
  console.log('Result:', error || data);
}
test();
