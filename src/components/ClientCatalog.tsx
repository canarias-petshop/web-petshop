'use client';

import { useState, useMemo } from 'react';
import AddToCartBtn from '@/components/AddToCartBtn';

export default function ClientCatalog({ productos }: { productos: any[] }) {
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
  const [selectedFamilias, setSelectedFamilias] = useState<string[]>([]);

  // Extraer listas únicas
  const marcasDisponibles = useMemo(() => {
    const m = new Set(productos.map(p => p.marca || 'Genérico'));
    return Array.from(m).sort();
  }, [productos]);

  const familiasDisponibles = useMemo(() => {
    const f = new Set(productos.map(p => p.familia || 'Otros'));
    return Array.from(f).sort();
  }, [productos]);

  // Manejar checks
  const toggleMarca = (m: string) => {
    setSelectedMarcas(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const toggleFamilia = (f: string) => {
    setSelectedFamilias(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  // Filtrado
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const pMarca = p.marca || 'Genérico';
      const pFamilia = p.familia || 'Otros';

      const matchMarca = selectedMarcas.length === 0 || selectedMarcas.includes(pMarca);
      const matchFamilia = selectedFamilias.length === 0 || selectedFamilias.includes(pFamilia);

      return matchMarca && matchFamilia;
    });
  }, [productos, selectedMarcas, selectedFamilias]);

  // Agrupar
  const groupedProducts = productosFiltrados.reduce((acc: any, prod: any) => {
    const fam = prod.familia || 'Otros';
    if (!acc[fam]) acc[fam] = [];
    acc[fam].push(prod);
    return acc;
  }, {});

  if (productos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        <h2>Aún no hay productos disponibles.</h2>
        <p>Desde el TPV de la tienda, asigna la "Categoría Web" a los productos para que aparezcan aquí.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* Sidebar de Filtros */}
      <aside style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '100px', backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Filtros</h3>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Categoría</h4>
          {familiasDisponibles.map(fam => (
            <label key={fam} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={selectedFamilias.includes(fam)}
                onChange={() => toggleFamilia(fam)}
              />
              <span>{fam}</span>
            </label>
          ))}
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Marca</h4>
          {marcasDisponibles.map(marca => (
            <label key={marca} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={selectedMarcas.includes(marca)}
                onChange={() => toggleMarca(marca)}
              />
              <span>{marca}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Grid de Productos */}
      <div style={{ flexGrow: 1 }}>
        {Object.keys(groupedProducts).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h3>No hay productos que coincidan con los filtros</h3>
            <button onClick={() => { setSelectedMarcas([]); setSelectedFamilias([]); }} className="btn btn-primary" style={{ marginTop: '1rem' }}>Limpiar Filtros</button>
          </div>
        ) : (
          Object.keys(groupedProducts).map((familia) => (
            <div key={familia} style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '2rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border)' }}>
                {familia}
              </h2>
              <div className="grid" style={{ padding: 0 }}>
                {groupedProducts[familia].map((prod: any) => (
                  <div key={prod.id} className="card">
                    <div className="card-img" style={{ backgroundImage: `url(/placeholder.png)`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: '#fff', height: '200px' }}></div>
                    <div className="card-content">
                      <div className="card-title">{prod.nombre}</div>
                      {prod.marca && prod.marca !== 'Genérico' && <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.2rem' }}>{prod.marca}</div>}
                      {prod.sku && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Ref: {prod.sku}</div>}
                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div className="card-price" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{Number(prod.precio_pvp).toFixed(2)} €</div>
                        <AddToCartBtn product={prod} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
