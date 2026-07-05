const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');
async function test() {
  const { data, error } = await supabase.from('productos').select('nombre, caracteristicas, sku').not('caracteristicas', 'is', null).neq('caracteristicas', '').limit(5);
  console.log('With Caracteristicas:', data);
  const { data: d2 } = await supabase.from('productos').select('nombre, caracteristicas, sku').limit(5);
  console.log('First 5:', d2);
}
test();
