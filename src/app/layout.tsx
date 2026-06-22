import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import NavbarCart from "@/components/NavbarCart";

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
              <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="/LOGO.jpg" alt="Animalarium" style={{ height: '80px', objectFit: 'contain' }} />
              </div>
              <div className="nav-links">
                <a href="#" className="nav-link">Catálogo</a>
                <a href="#" className="nav-link">Contacto</a>
                <NavbarCart />
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
