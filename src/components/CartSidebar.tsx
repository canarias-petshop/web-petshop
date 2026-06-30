'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, total } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="cart-overlay" 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90,
          backdropFilter: 'blur(2px)'
        }}
      />
      <div 
        className="cart-sidebar"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px',
          backgroundColor: 'var(--surface)', zIndex: 100, boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Tu Carrito</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              Tu carrito está vacío.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => {
                const isCaja = item.nombre?.toLowerCase().includes('caja');
                const originalPrice = isCaja ? item.precio / 0.9 : item.precio;
                return (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>
                      {item.nombre}
                      {isCaja && (
                        <span style={{ 
                          display: 'inline-block',
                          marginLeft: '8px',
                          background: '#e74c3c', color: 'white', 
                          padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold'
                        }}>
                          -10% DTO.
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
                      {isCaja && (
                        <span style={{ textDecoration: 'line-through', marginRight: '6px', fontSize: '0.8rem', opacity: 0.7 }}>
                          {originalPrice.toFixed(2)} €
                        </span>
                      )}
                      <span style={{ color: isCaja ? '#e74c3c' : 'inherit', fontWeight: isCaja ? 'bold' : 'normal' }}>
                        {item.precio.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)', cursor: 'pointer' }}>-</button>
                    <span style={{ width: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
              <span>Total:</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setIsCartOpen(false);
                router.push('/checkout');
              }} 
              style={{ width: '100%', padding: '1rem' }}
            >
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}
