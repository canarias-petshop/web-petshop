'use client';

import { useCart, CartItem } from '@/context/CartContext';

export default function AddToCartBtn({ product, mini = false }: { product: Omit<CartItem, 'cantidad'> & { precio_pvp?: number | string }, mini?: boolean }) {
  const { addToCart } = useCart();

  return (
    <button 
      className="btn btn-primary"
      onClick={() => addToCart(product)}
      style={mini ? {
        backgroundColor: '#E84D8A',
        color: 'white',
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(232, 77, 138, 0.3)',
        transition: 'all 0.2s ease'
      } : {
        backgroundColor: '#E84D8A',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 4px 6px rgba(232, 77, 138, 0.3)',
        transition: 'all 0.2s ease'
      }}
    >
      {mini ? '+ AÑADIR' : 'AÑADIR AL CARRITO'}
    </button>
  );
}
