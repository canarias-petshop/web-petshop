import { supabase } from '@/lib/supabase';
import ClientCatalog from '@/components/ClientCatalog';

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {
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

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Nuestro Catálogo</h1>
        <p style={{ color: 'var(--text-muted)' }}>Encuentra la mejor alimentación natural para tu mascota.</p>
      </div>
      <section className="container" id="catalogo">
        <ClientCatalog productos={productos || []} />
      </section>
    </div>
  );
}
