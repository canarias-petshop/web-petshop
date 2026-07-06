import Link from 'next/link';
import PromoBanner from '@/components/PromoBanner';
import { supabaseAdmin } from '@/lib/supabase';
import FloatingProductWidget from '@/components/FloatingProductWidget';
import FeaturedProductsGrid from '@/components/FeaturedProductsGrid';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch random subset or all web products for the widget
  const { data: productos, error } = await supabaseAdmin!
    .from('productos')
    .select('*')
    .not('familia', 'is', null)
    .neq('familia', '');

  if (error) {
    console.error("Error fetching products for Home:", error);
  }

  return (
    <div>
      <PromoBanner />
      <section className="hero">
        <div className="container">
          <div className="hero-box">
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: '1.2' }}>Especialistas en Alimentación Natural</h1>
            <p style={{ margin: '0.5rem auto 1rem', fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600', fontStyle: 'italic' }}>
              "Queremos lo mejor para tu mascota y lo mejor es Animalarium"
            </p>
            <Link href="/catalogo" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>
      
      {/* Nueva Sección: Ofertas Destacadas */}
      <section className="container" style={{ paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Ofertas y Destacados</h2>
          <Link href="/catalogo" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>Ir a tienda →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
          {/* Tarjeta Promocional 1 */}
          <div style={{ backgroundColor: '#ffe4e6', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #fda4af' }}>
            <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#e11d48', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>-7% DTO</span>
            <h3 style={{ fontSize: '1.3rem', color: '#be123c', marginBottom: '0.25rem', zIndex: 2, fontWeight: 700 }}>Cajas Húmedo</h3>
            <p style={{ color: '#881337', marginBottom: '1rem', zIndex: 2, fontSize: '0.9rem', lineHeight: '1.3' }}>Ahorra al instante llevando la caja entera.</p>
            <Link href="/catalogo?categoria=Alimentación húmeda" className="btn btn-primary" style={{ alignSelf: 'flex-start', zIndex: 2, padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Ver Húmedos</Link>
          </div>
          
          {/* Tarjeta Promocional 2 */}
          <div style={{ backgroundColor: '#e0f2fe', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #7dd3fc' }}>
            <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#0284c7', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>Novedad</span>
            <h3 style={{ fontSize: '1.3rem', color: '#0369a1', marginBottom: '0.25rem', zIndex: 2, fontWeight: 700 }}>Snacks Naturales</h3>
            <p style={{ color: '#0c4a6e', marginBottom: '1rem', zIndex: 2, fontSize: '0.9rem', lineHeight: '1.3' }}>Los mejores ingredientes 100% naturales.</p>
            <Link href="/catalogo?categoria=Snack" className="btn" style={{ alignSelf: 'flex-start', zIndex: 2, backgroundColor: '#0284c7', color: 'white', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Ver Snacks</Link>
          </div>
        </div>
        
        <FeaturedProductsGrid productos={productos || []} />
      </section>

      <section className="container" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Nuestras Especialidades</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Para una dieta sana y equilibrada.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥩</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Pienso y Carne Fresca</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.3' }}>Fórmulas grain-free ricas en carne para perros y gatos.</p>
          </div>
          
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🦴</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Snacks Naturales</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.3' }}>Premios saludables y funcionales para educar o mimar.</p>
          </div>
          
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🐾</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Asesoramiento</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.3' }}>Te asesoramos en la tienda física para elegir lo mejor.</p>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
        <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '2px dashed var(--secondary)', padding: '1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>¡Ven a visitarnos!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Estaremos encantados de asesorarte en persona.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--surface)', padding: '0.75rem 1.25rem', borderRadius: '100px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.2rem' }}>📍</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Calle José Hernández Alfonso 26, SC Tenerife</span>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¿Buscas algo en concreto?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>Explora nuestro catálogo con cientos de referencias siempre en stock.</p>
          <Link href="/catalogo" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Entrar a la Tienda
          </Link>
        </div>
      </section>

      <FloatingProductWidget productos={productos || []} />
    </div>
  );
}
