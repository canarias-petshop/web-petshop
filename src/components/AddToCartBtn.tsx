'use client';

import { useCart } from '@/context/CartContext';

export default function AddToCartBtn({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button 
      className="btn btn-primary"
      onClick={() => addToCart(product)}
      style={{
        backgroundColor: '#E84D8A',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        marginTop: '10px'
      }}
    >
      AÑADIR AL CARRITO
    </button>
  );
}
