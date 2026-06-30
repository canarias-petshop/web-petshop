'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddToCartBtn from '@/components/AddToCartBtn';

export default function FeaturedProductsGrid({ productos }: { productos: any[] }) {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    if (!productos || productos.length === 0) return;

    // Filter for "pienso" or "seca"
    const piensos = productos.filter(p => {
      const family = (p.familia || '').toLowerCase();
      const subcat = (p.subcategoria || '').toLowerCase();
      const catWeb = (p.categoria_web || '').toLowerCase();
      const name = (p.nombre || '').toLowerCase();
      
      const isDry = family.includes('seco') || subcat.includes('seco') || catWeb.includes('seca') || name.includes('pienso');
      const isNotCaja = !name.includes('caja');
      return isDry && isNotCaja && p.marca !== 'Genérico' && p.marca !== 'Servicio';
    });

    if (piensos.length === 0) return;

    // Shuffle array and take 6
    const shuffled = [...piensos].sort(() => 0.5 - Math.random());
    setFeatured(shuffled.slice(0, 6));
  }, [productos]);

  if (featured.length === 0) return null;

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', borderBottom: '2px solid var(--surface-hover)', paddingBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>
          Piensos Destacados
        </h3>
        <Link href="/catalogo" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
          Ver todos →
        </Link>
      </div>
      
      <div className="grid" style={{ padding: 0 }}>
        {featured.map(prod => {
          const originalPrice = Number(prod.precio_pvp) || 0;
          return (
            <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s', border: '1px solid var(--border)' }}>
              <div style={{ position: 'relative', height: '220px', padding: '1rem', backgroundColor: '#ffffff', borderBottom: '1px solid var(--surface-hover)' }}>
                <Link href={`/catalogo?search=${encodeURIComponent(prod.sku || prod.nombre)}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                  <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: prod.sku 
                      ? `url("/images/productos/${encodeURIComponent(prod.sku)}.jpg"), url("/placeholder.png")` 
                      : `url("/placeholder.png")`, 
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                  }} />
                </Link>
                {prod.marca && (
                   <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                     {prod.marca}
                   </span>
                )}
              </div>

              <div className="card-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '1.25rem' }}>
                <Link href={`/catalogo?search=${encodeURIComponent(prod.sku || prod.nombre)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <div className="card-title" style={{ fontSize: '1rem', lineHeight: '1.3', marginBottom: '0.5rem', fontWeight: '600' }}>
                    {prod.nombre}
                  </div>
                </Link>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
                  {prod.mascota && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px'}}>{prod.mascota}</span>}
                  {prod.gama && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px', border: '1px solid var(--border)'}}>{prod.gama}</span>}
                  {prod.edad && prod.edad !== 'Todas' && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px'}}>{prod.edad}</span>}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)' }}>
                    {originalPrice.toFixed(2)} €
                  </span>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <AddToCartBtn product={{...prod, precio: originalPrice, precio_pvp: originalPrice}} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
