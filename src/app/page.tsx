import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-box">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Especialistas en Alimentación Natural</h1>
            <p style={{ margin: '1rem auto 2rem', fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '600', fontStyle: 'italic' }}>
              "Queremos lo mejor para tu mascota y lo mejor es Animalarium"
            </p>
            <Link href="/catalogo" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
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
    </div>
  );
}
