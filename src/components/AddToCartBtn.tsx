'use client';

import { useCart, CartItem } from '@/context/CartContext';

export default function AddToCartBtn({ product, mini = false }: { product: Omit<CartItem, 'cantidad'> & { precio_pvp?: number | string }, mini?: boolean }) {
  const { addToCart } = useCart();

  return (
    <button 
      className={`btn btn-primary ${mini ? 'mini-btn' : 'full-btn'}`}
      onClick={() => addToCart(product)}
      style={mini ? {
        padding: '4px 10px',
        fontSize: '0.8rem',
      } : {
        width: '100%',
        textTransform: 'uppercase',
      }}
    >
      {mini ? '+ AÑADIR' : 'Añadir al carrito'}
    </button>
  );
}
