'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ cliente: '', telefono: '', direccion: '', notas: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isCartOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, ...formData })
      });
      
      if (res.ok) {
        setStatus('success');
        clearCart();
        setTimeout(() => {
          setIsCartOpen(false);
          setStatus('idle');
          setIsCheckingOut(false);
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{isCheckingOut ? 'Finalizar Pedido' : 'Tu Carrito'}</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>¡Pedido Recibido!</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Te avisaremos en cuanto esté listo para recoger.</p>
            </div>
          ) : isCheckingOut ? (
            <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Nombre y Apellidos *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Paco Pérez"
                  value={formData.cliente}
                  onChange={e => setFormData({...formData, cliente: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Teléfono *</label>
                <input required type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Dirección de Entrega (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Calle, Número, Piso (Para envíos a domicilio)"
                  value={formData.direccion} 
                  onChange={e => setFormData({...formData, direccion: e.target.value})} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Notas (opcional)</label>
                <textarea value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '80px' }} />
              </div>
              {status === 'error' && <div style={{ color: '#EF4444' }}>Ocurrió un error al enviar el pedido.</div>}
            </form>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              Tu carrito está vacío.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{item.nombre}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.precio.toFixed(2)} €</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)', cursor: 'pointer' }}>-</button>
                    <span style={{ width: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && status !== 'success' && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
              <span>Total:</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            
            {isCheckingOut ? (
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <button className="btn" onClick={() => setIsCheckingOut(false)} style={{ flex: 1, backgroundColor: '#E5E7EB', color: '#374151' }}>Volver</button>
                 <button form="checkout-form" type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={status === 'loading'}>
                   {status === 'loading' ? 'Enviando...' : 'Confirmar Pedido'}
                 </button>
               </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsCheckingOut(true)} style={{ width: '100%', padding: '1rem' }}>
                Proceder al Pago
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
