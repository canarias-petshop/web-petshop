import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import NavbarCart from "@/components/NavbarCart";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Animalarium | Tu Tienda Local",
  description: "Compra piensos, carnes y accesorios para tu mascota. Recogida en tienda y entrega rápida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ClientProviders>
          <nav className="navbar">
            <div className="container navbar-content">
              <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Image src="/LOGO.jpg" alt="Animalarium" width={220} height={110} style={{ objectFit: 'contain' }} />
              </Link>
              <div className="nav-links">
                <Link href="/catalogo" className="nav-link">Catálogo</Link>
                <Link href="/mi-cuenta" className="nav-link">Mi Cuenta</Link>
                <Link href="#" className="nav-link">Contacto</Link>
                <NavbarCart />
              </div>
            </div>
          </nav>
          <main style={{ minHeight: '80vh' }}>{children}</main>
          
          <footer style={{ backgroundColor: '#1f2937', color: '#f3f4f6', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                
                {/* Columna 1: Marca y Sobre nosotros */}
                <div>
                  <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1rem', fontWeight: 700 }}>Animalarium</h3>
                  <p style={{ color: '#9ca3af', marginBottom: '1rem', lineHeight: '1.6' }}>Especialistas en Alimentación Natural para Mascotas. Queremos lo mejor para tu compañero de vida.</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ padding: '0.5rem', backgroundColor: '#374151', borderRadius: '50%', cursor: 'pointer' }}>📸</span>
                    <span style={{ padding: '0.5rem', backgroundColor: '#374151', borderRadius: '50%', cursor: 'pointer' }}>📘</span>
                  </div>
                </div>

                {/* Columna 2: Enlaces Rápidos */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Enlaces Rápidos</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <li><Link href="/catalogo" style={{ color: '#9ca3af', transition: 'color 0.2s' }}>Tienda Online</Link></li>
                    <li><Link href="/mi-cuenta" style={{ color: '#9ca3af', transition: 'color 0.2s' }}>Mi Cuenta / Pedidos</Link></li>
                    <li><Link href="#" style={{ color: '#9ca3af', transition: 'color 0.2s' }}>Programa de Puntos</Link></li>
                  </ul>
                </div>

                {/* Columna 3: Contacto */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Atención al Cliente</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#9ca3af' }}>
                    <li>📍 C. José Hernández Alfonso 26<br/>Santa Cruz de Tenerife</li>
                    <li>📞 922 065 170</li>
                    <li>📱 672 481 295 (WhatsApp)</li>
                    <li>✉️ animalarium.tenerife@gmail.com</li>
                  </ul>
                </div>

                {/* Columna 4: Pago Seguro */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Compra 100% Segura</h4>
                  <p style={{ color: '#9ca3af', marginBottom: '1rem', fontSize: '0.9rem' }}>Aceptamos pagos al recoger, Bizum y enlaces de pago seguro (Tarjeta).</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#374151', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Visa</span>
                    <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#374151', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Mastercard</span>
                    <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#374151', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Bizum</span>
                  </div>
                </div>

              </div>

              {/* Bottom Footer */}
              <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                <p>© {new Date().getFullYear()} Animalarium. Todos los derechos reservados.</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <Link href="/aviso-legal">Aviso Legal</Link>
                  <Link href="/privacidad">Privacidad</Link>
                  <Link href="/terminos">Envíos y Devoluciones</Link>
                </div>
              </div>
            </div>
          </footer>
          <WhatsAppButton />
        </ClientProviders>
      </body>
    </html>
  );
}
