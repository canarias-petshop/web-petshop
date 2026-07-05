const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');

async function test() {
  const { data: cols } = await supabase.from('ventas_historial').select('*').limit(1);
  console.log('ventas_historial columns:', Object.keys(cols[0] || {}));
  
  const { data: cols2 } = await supabase.from('encargos_clientes').select('*').limit(1);
  console.log('encargos_clientes columns:', Object.keys(cols2[0] || {}));

  const { data: raquel } = await supabase.from('clientes').select('*').ilike('nombre_dueno', '%raquel%');
  console.log('Raquel:', raquel);
}
test();
