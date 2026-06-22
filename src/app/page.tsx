import { supabase } from '@/lib/supabase';
import ClientCatalog from '@/components/ClientCatalog';

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function Home() {
  // Fetch products that have a 'familia' (Category) assigned for the Web
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
    .not('familia', 'is', null)
    .neq('familia', '')
    .order('familia')
    .order('nombre');

  if (error) {
    console.error("Error fetching products:", error);
  }

  // Agrupar productos por familia
  const groupedProducts = (productos || []).reduce((acc: any, prod: any) => {
    const fam = prod.familia || 'Otros';
    if (!acc[fam]) acc[fam] = [];
    acc[fam].push(prod);
    return acc;
  }, {});

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Los mejores productos para tu mascota</h1>
          <p>Ofrecemos dietas naturales, piensos premium y los mejores accesorios. Siempre en stock y listos para recoger en nuestra tienda o enviar en 24/48h.</p>
          <a href="#catalogo" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Ver Catálogo
          </a>
        </div>
      </section>
      
      <section className="container" id="catalogo" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <ClientCatalog productos={productos || []} />
      </section>
    </div>
  );
}
