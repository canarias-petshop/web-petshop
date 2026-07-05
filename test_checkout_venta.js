const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');

async function test() {
  const { data, error } = await supabase.from('ventas_historial').insert({
        fecha: '30/06/2026 13:33',
        productos: [],
        total: 10,
        pagado: 0,
        pendiente: 10,
        metodo_pago: 'Bizum (WEB)',
        metodo: 'Bizum (WEB)',
        cliente_fidel: 'Test',
        cliente_deuda: 'Test',
        puntos_ganados: 0,
        puntos_usados: 0,
        puntos_descontados: 0,
        nuevo_saldo: 0,
        descuento_global: 0,
        hash_anterior: 'GENESIS',
        hash_actual: 'hash',
        estado: 'Deuda',
        empleado: 'WEB'
  }).select();
  console.log('Result:', error || data);
}
test();
