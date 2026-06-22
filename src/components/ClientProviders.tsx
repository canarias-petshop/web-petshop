'use client';

import { CartProvider } from '@/context/CartContext';
import CartSidebar from './CartSidebar';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartSidebar />
    </CartProvider>
  );
}
