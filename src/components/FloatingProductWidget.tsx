/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function FloatingProductWidget({ productos }: { productos: any[] }) {
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Si no hay productos o el usuario cerró el widget para siempre, salimos
    if (!productos || productos.length === 0 || isDismissed) return;

    const showRandomProduct = () => {
      // Evitar que salgan servicios o genéricos (aunque ya se filtran en backend, doble check)
      const validProducts = productos.filter(p => p.marca !== 'Genérico' && p.marca !== 'Generico' && p.marca !== 'Servicio');
      if (validProducts.length === 0) return;

      const randomIdx = Math.floor(Math.random() * validProducts.length);
      setCurrentProduct(validProducts[randomIdx]);
      setIsVisible(true);

      // Ocultar después de 6 segundos
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    // Primera aparición a los 4 segundos
    const initialTimeout = setTimeout(showRandomProduct, 4000);

    // Luego, una aparición nueva cada 15 segundos
    const interval = setInterval(() => {
      showRandomProduct();
    }, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [productos, isDismissed]);

  if (!currentProduct || isDismissed) return null;

  const originalPrice = Number(currentProduct.precio_pvp) || 0;
  const isCaja = currentProduct.nombre?.toLowerCase().includes('caja');
  const finalPrice = isCaja ? originalPrice * 0.93 : originalPrice;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        padding: '0.75rem',
        width: 'min(280px, 70vw)',
        zIndex: 9999,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(150%) scale(0.5)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center'
      }}
    >
      <button 
        onClick={() => setIsDismissed(true)}
        aria-label="Cerrar notificación"
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: '50%',
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 10
        }}
      >
        <X size={16} />
      </button>

      <div style={{
        width: '60px',
        height: '60px',
        flexShrink: 0,
        backgroundColor: '#fff',
        borderRadius: 'var(--radius)',
        backgroundImage: currentProduct.sku ? `url("/images/productos/${encodeURIComponent(currentProduct.sku)}.jpg")` : `url("/placeholder.png")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        border: '1px solid var(--surface-hover)'
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flexGrow: 1 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
          ¡Te podría gustar!
        </span>
        <h4 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)', fontWeight: 600 }}>
          {currentProduct.nombre}
        </h4>
        {currentProduct.marca && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            {currentProduct.marca}
          </span>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.4rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isCaja ? '#e74c3c' : 'var(--text)' }}>
            {finalPrice.toFixed(2)} €
          </span>
          <Link href={`/catalogo?search=${encodeURIComponent(currentProduct.sku || currentProduct.nombre)}`} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}
