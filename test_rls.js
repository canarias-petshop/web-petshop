const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');
const supabase = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');

async function testRls() {
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: 'test_rls_user@test.com',
    password: 'Password123!',
    email_confirm: true
  });
  if (authError) { console.log('Auth Error:', authError); return; }
  const userId = authData.user.id;
  
  const { error: insertError } = await supabaseAdmin.from('clientes').insert({
    nombre_dueno: 'RLS Test',
    telefono: '999999999',
    auth_user_id: userId
  });
  if (insertError) { console.log('Insert Error:', insertError); return; }

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: 'test_rls_user@test.com',
    password: 'Password123!'
  });
  if (loginError) { console.log('Login Error:', loginError); return; }

  const { data, error } = await supabase.from('clientes').select('*, mascotas(*, citas(*))').eq('auth_user_id', userId).single();
  console.log('Query Data:', data);
  console.log('Query Error:', error);

  // cleanup
  await supabaseAdmin.from('clientes').delete().eq('auth_user_id', userId);
  await supabaseAdmin.auth.admin.deleteUser(userId);
}
testRls();
