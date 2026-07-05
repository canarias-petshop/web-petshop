import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contacto | Animalarium Tenerife',
  description: 'Contacta con Animalarium. Estamos en C. José Hernández Alfonso 26, Santa Cruz de Tenerife. Teléfono: 922 065 170. WhatsApp: 672 481 295.',
  alternates: { canonical: '/contacto' },
};

export default function ContactoPage() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Contacto</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
        Estamos encantados de atenderte. Puedes visitarnos en tienda, llamarnos o escribirnos por WhatsApp.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>

        {/* Dirección */}
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📍</div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Dónde estamos</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            C. José Hernández Alfonso, 26<br />
            38005 Santa Cruz de Tenerife<br />
            Islas Canarias
          </p>
          <a
            href="https://maps.google.com/?q=C.+José+Hernández+Alfonso+26,+Santa+Cruz+de+Tenerife"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}
          >
            Ver en Google Maps →
          </a>
        </div>

        {/* Teléfono */}
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📞</div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Teléfono</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Llámanos en horario de tienda:</p>
          <a href="tel:+34922065170" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>
            922 065 170
          </a>
        </div>

        {/* WhatsApp */}
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>WhatsApp</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            La forma más rápida de contactarnos para pedidos o consultas.
          </p>
          <a
            href="https://wa.me/34672481295"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ display: 'inline-block', padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}
          >
            Escribir por WhatsApp
          </a>
        </div>

        {/* Email */}
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✉️</div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Para consultas no urgentes:</p>
          <a href="mailto:animalarium.tenerife@gmail.com" style={{ color: 'var(--primary)', fontWeight: 600, wordBreak: 'break-all' }}>
            animalarium.tenerife@gmail.com
          </a>
        </div>

      </div>

      {/* Horario */}
      <div style={{ marginTop: '2rem', backgroundColor: 'var(--surface)', border: '2px solid var(--primary)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>🕐 Horario de atención</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <div><strong style={{ color: 'var(--text-main)' }}>Lunes a Viernes</strong><br />9:00 – 14:00 / 17:00 – 20:30</div>
          <div><strong style={{ color: 'var(--text-main)' }}>Sábados</strong><br />9:00 – 14:00</div>
          <div><strong style={{ color: 'var(--text-main)' }}>Domingos y festivos</strong><br />Cerrado</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link href="/catalogo" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Ver nuestro catálogo →
        </Link>
      </div>
    </div>
  );
}
