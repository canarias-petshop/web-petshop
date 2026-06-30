"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Package, Star, Truck } from 'lucide-react';

const MESSAGES = [
  { text: '¡10% de descuento en tu primera compra al registrarte!', icon: Sparkles },
  { text: '7% de descuento por la compra de cajas enteras de pouch.', icon: Package },
  { text: 'Programa de Fidelidad: Acumula puntos con tus compras y consigue descuentos.', icon: Star },
  { text: 'Envío gratuito en pedidos superiores a 130€.', icon: Truck },
];

export default function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = MESSAGES[currentIndex].icon;

  return (
    <div style={{
      backgroundColor: 'var(--primary)',
      color: 'white',
      padding: '0.75rem',
      textAlign: 'center',
      fontSize: '0.95rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '44px'
    }}>
      <div 
        key={currentIndex} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeInOut 4.5s ease-in-out infinite'
        }}
      >
        <CurrentIcon size={18} />
        <span>{MESSAGES[currentIndex].text}</span>
      </div>

      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @media (max-width: 768px) {
          span {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
