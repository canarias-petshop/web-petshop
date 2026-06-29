import type { Metadata } from "next";
import Link from "next/link";
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
                <img src="/LOGO.jpg" alt="Animalarium" style={{ height: '80px', objectFit: 'contain' }} />
              </Link>
              <div className="nav-links">
                <Link href="/catalogo" className="nav-link">Catálogo</Link>
                <Link href="#" className="nav-link">Contacto</Link>
                <NavbarCart />
              </div>
            </div>
          </nav>
          <main style={{ minHeight: '80vh' }}>{children}</main>
          
          <footer style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '3rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>Animalarium</h3>
              <p style={{ marginBottom: '0.5rem' }}>Especialistas en Alimentación Natural para Mascotas</p>
              <p style={{ marginBottom: '0.25rem' }}>📍 Calle José Hernández Alfonso 26, Santa Cruz de Tenerife</p>
              <p style={{ marginBottom: '1.5rem' }}>📞 922 065 170 / 📱 672 481 295 (WhatsApp) | ✉️ animalarium.tenerife@gmail.com</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <Link href="/aviso-legal" style={{ textDecoration: 'underline' }}>Aviso Legal</Link>
                <Link href="/privacidad" style={{ textDecoration: 'underline' }}>Política de Privacidad</Link>
                <Link href="/terminos" style={{ textDecoration: 'underline' }}>Condiciones de Envío y Compra</Link>
              </div>

              <p style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.7 }}>© {new Date().getFullYear()} Animalarium. Todos los derechos reservados.</p>
            </div>
          </footer>
          <WhatsAppButton />
        </ClientProviders>
      </body>
    </html>
  );
}
