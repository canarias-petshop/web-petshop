import Link from 'next/link';
import PromoBanner from '@/components/PromoBanner';
import { supabase } from '@/lib/supabase';
import FloatingProductWidget from '@/components/FloatingProductWidget';
import FeaturedProductsGrid from '@/components/FeaturedProductsGrid';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch random subset or all web products for the widget
  const { data: productos, error } = await supabase
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
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Especialistas en Alimentación Natural</h1>
            <p style={{ margin: '1rem auto 2rem', fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '600', fontStyle: 'italic' }}>
              &quot;Queremos lo mejor para tu mascota y lo mejor es Animalarium&quot;
            </p>
            <Link href="/catalogo" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>
      
      {/* Nueva Sección: Ofertas Destacadas */}
      <section className="container" style={{ paddingTop: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Ofertas y Destacados</h2>
          <Link href="/catalogo" style={{ color: 'var(--primary)', fontWeight: 600 }}>Ir a la tienda →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Tarjeta Promocional 1 */}
          <div style={{ backgroundColor: '#ffe4e6', borderRadius: 'var(--radius)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #fda4af' }}>
            <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#e11d48', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>-7% DTO</span>
            <h3 style={{ fontSize: '1.8rem', color: '#be123c', marginBottom: '0.5rem', zIndex: 2, fontWeight: 700 }}>Cajas de Húmedo</h3>
            <p style={{ color: '#881337', marginBottom: '1.5rem', zIndex: 2, fontSize: '1.1rem' }}>Llévate la caja entera (pouches o latas) y ahorra al instante.</p>
            <Link href="/catalogo" className="btn btn-primary" style={{ alignSelf: 'flex-start', zIndex: 2 }}>Ver Húmedos</Link>
          </div>
          
          {/* Tarjeta Promocional 2 */}
          <div style={{ backgroundColor: '#e0f2fe', borderRadius: 'var(--radius)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #7dd3fc' }}>
            <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#0284c7', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Novedad</span>
            <h3 style={{ fontSize: '1.8rem', color: '#0369a1', marginBottom: '0.5rem', zIndex: 2, fontWeight: 700 }}>Snacks Naturales</h3>
            <p style={{ color: '#0c4a6e', marginBottom: '1.5rem', zIndex: 2, fontSize: '1.1rem' }}>Premia a tu mascota con los mejores ingredientes 100% naturales.</p>
            <Link href="/catalogo" className="btn" style={{ alignSelf: 'flex-start', zIndex: 2, backgroundColor: '#0284c7', color: 'white' }}>Explorar Snacks</Link>
          </div>
        </div>
        
        <FeaturedProductsGrid productos={productos || []} />
      </section>

      <section className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>Nuestras Especialidades</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>Todo lo que necesitas para una dieta sana y equilibrada.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥩</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Pienso y Carne Fresca</h3>
            <p style={{ color: 'var(--text-muted)' }}>Trabajamos con las mejores marcas del mercado como Amanova. Fórmulas grain-free, hipoalergénicas y ricas en carne fresca para perros y gatos.</p>
          </div>
          
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦴</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Snacks Naturales</h3>
            <p style={{ color: 'var(--text-muted)' }}>Premios saludables y funcionales. Desde sticks dentales hasta bocaditos gourmet para educar o mimar a tu mejor amigo.</p>
          </div>
          
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Asesoramiento Personalizado</h3>
            <p style={{ color: 'var(--text-muted)' }}>¿No sabes qué pienso elegir? Ven a visitarnos a la tienda física y te asesoraremos en función de la raza, edad y necesidades de tu mascota.</p>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '2px dashed var(--secondary)', padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}>¡Ven a visitarnos!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Estaremos encantados de recibirte a ti y a tu peludo. Te asesoraremos en persona para encontrar la dieta perfecta.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--surface)', padding: '1rem 2rem', borderRadius: '100px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.5rem' }}>📍</span>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Calle José Hernández Alfonso 26, Santa Cruz de Tenerife</span>
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
