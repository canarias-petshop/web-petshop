'use client';

import { useCart } from '@/context/CartContext';

export default function NavbarCart() {
  const { items, setIsCartOpen } = useCart();
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <button 
      className="btn btn-primary" 
      style={{ padding: '0.5rem 1rem', position: 'relative' }}
      onClick={() => setIsCartOpen(true)}
    >
      🛒 Carrito
      {totalItems > 0 && (
        <span style={{
          position: 'absolute', top: '-8px', right: '-8px',
          backgroundColor: '#EF4444', color: 'white',
          borderRadius: '9999px', width: '20px', height: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 'bold'
        }}>
          {totalItems}
        </span>
      )}
    </button>
  );
}
