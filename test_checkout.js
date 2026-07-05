const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');

async function test() {
  const { data, error } = await supabase.from('encargos_clientes').insert({
        nombre_cliente: 'TESTING',
        telefono: '123456789',
        detalle_pedido: 'test',
        notas: 'test notas',
        estado: 'Pendiente',
        origen: 'Web'
  }).select();
  console.log('Result:', error || data);
}
test();
