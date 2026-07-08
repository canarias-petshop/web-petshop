import { supabaseAdmin } from '@/lib/supabase';
import ClientCatalog from '@/components/ClientCatalog';
import PromoBanner from '@/components/PromoBanner';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {
  // Fetch products that have a 'familia' (Category) assigned for the Web
  const { data: productos, error } = await supabaseAdmin!
    .from('productos')
    .select('*')
    .not('familia', 'is', null)
    .neq('familia', '')
    .order('familia')
    .order('nombre');

  if (error) {
    console.error("Error fetching products:", error);
  }

  let skusWithImages = new Set<string>();
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'productos');
    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir);
      skusWithImages = new Set(imageFiles.filter(f => f.endsWith('.jpg')).map(f => f.replace('.jpg', '')));
    }
  } catch (e) {
    console.error("Error reading images dir:", e);
  }

  const validProductos = (productos || []).filter(p => p.sku && skusWithImages.has(p.sku));


  return (
    <div>
      <PromoBanner />
      <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Nuestro Catálogo</h1>
        <p style={{ color: 'var(--text-muted)' }}>Encuentra la mejor alimentación natural para tu mascota.</p>
      </div>
      <section className="container" id="catalogo">
        <ClientCatalog productos={validProductos.filter(p => p.marca !== 'Genérico' && p.marca !== 'Generico' && p.marca !== 'Servicio')} />
      </section>
      </div>
    </div>
  );
}
