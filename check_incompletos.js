const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('productos').select('*');
  if (error) { console.error(error); return; }
  
  let count_generico = 0;
  let count_no_mascota = 0;
  let count_no_marca = 0;
  let count_no_subcat = 0;
  
  for (let p of data) {
      if (p.categoria !== 'Producto') continue;
      
      if (!p.familia || p.familia === 'Generico') count_generico++;
      if (!p.mascota || p.mascota === 'Universal') count_no_mascota++;
      if (!p.marca || p.marca === 'Generico') count_no_marca++;
      if (!p.subcategoria) count_no_subcat++;
  }
  
  console.log(`Total Productos: ${data.filter(p => p.categoria === 'Producto').length}`);
  console.log(`Falta familia: ${count_generico}`);
  console.log(`Falta mascota: ${count_no_mascota}`);
  console.log(`Falta marca: ${count_no_marca}`);
  console.log(`Falta subcategoria: ${count_no_subcat}`);
}

run();
