'use client';

import { useState, useMemo } from 'react';
import AddToCartBtn from '@/components/AddToCartBtn';

export type Product = {
  id: string;
  nombre: string;
  marca?: string;
  gama?: string;
  subcategoria?: string;
  familia?: string;
  mascota?: string;
  edad?: string;
  tamano?: string;
  necesidad_especial?: string;
  sabor_principal?: string;
  precio_pvp?: string | number;
  sku?: string;
  caracteristicas?: string;
};

// Componente reutilizable para renderizar cada bloque de checkboxes (Acordeón)
function FilterSection({ title, options, state, setter, onToggle, defaultExpanded = false }: { title: string, options: string[], state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, onToggle: (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => void, defaultExpanded?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  if (options.length === 0) return null;
  
  return (
    <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--surface-hover)', paddingBottom: '0.8rem' }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>
        <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1' }}>{isExpanded ? '−' : '+'}</span>
      </div>
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.8rem' }}>
          {options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={state.includes(opt)}
                onChange={() => onToggle(setter, opt)}
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
              />
              <span style={{ color: state.includes(opt) ? 'var(--text)' : 'var(--text-muted)' }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para filtro anidado de marcas
function BrandFilterSection({ productos, selectedMarcas, setSelectedMarcas, selectedMarcaSubs, setSelectedMarcaSubs }: { productos: Product[], selectedMarcas: string[], setSelectedMarcas: React.Dispatch<React.SetStateAction<string[]>>, selectedMarcaSubs: Record<string, string[]>, setSelectedMarcaSubs: React.Dispatch<React.SetStateAction<Record<string, string[]>>> }) {
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
  
  // Extract brands and their subcategories
  const brandsObj = useMemo(() => {
    const obj: Record<string, Set<string>> = {};
    for (const p of productos) {
      if (!p.marca || p.marca === 'Genérico' || p.marca === 'Servicio') continue;
      if (!obj[p.marca]) obj[p.marca] = new Set();
      const nestedVal = p.gama || p.subcategoria;
      if (nestedVal) obj[p.marca].add(nestedVal);
    }
    return obj;
  }, [productos]);

  const marcas = Object.keys(brandsObj).sort();
  if (marcas.length === 0) return null;

  const toggleBrand = (marca: string) => {
    if (selectedMarcas.includes(marca)) {
      setSelectedMarcas((prev: string[]) => prev.filter(m => m !== marca));
      // Optionally clear its subcategories
      setSelectedMarcaSubs((prev) => ({ ...prev, [marca]: [] }));
    } else {
      setSelectedMarcas((prev: string[]) => [...prev, marca]);
      // Clear its subcategories so the whole brand is selected
      setSelectedMarcaSubs((prev) => ({ ...prev, [marca]: [] }));
    }
  };

  const toggleSub = (marca: string, sub: string) => {
    const currentSubs = selectedMarcaSubs[marca] || [];
    let newSubs;
    if (currentSubs.includes(sub)) {
      newSubs = currentSubs.filter(s => s !== sub);
    } else {
      newSubs = [...currentSubs, sub];
    }
    setSelectedMarcaSubs((prev) => ({ ...prev, [marca]: newSubs }));
    
    // If a sub is toggled, uncheck the main brand to indicate partial selection
    if (newSubs.length > 0 && selectedMarcas.includes(marca)) {
      setSelectedMarcas((prev: string[]) => prev.filter(m => m !== marca));
    }
  };

  const toggleExpand = (marca: string) => {
    setExpandedBrands(prev => prev.includes(marca) ? prev.filter(m => m !== marca) : [...prev, marca]);
  };

  return (
    <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--surface-hover)', paddingBottom: '0.8rem' }}>
      <h4 style={{ margin: '0 0 0.8rem 0', color: 'var(--text)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marca</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {marcas.map(marca => {
          const subcats = Array.from(brandsObj[marca]).sort();
          const isExpanded = expandedBrands.includes(marca);
          const isBrandChecked = selectedMarcas.includes(marca);
          const activeSubs = selectedMarcaSubs[marca] || [];
          
          return (
            <div key={marca} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={isBrandChecked}
                    onChange={() => toggleBrand(marca)}
                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                  />
                  <span style={{ color: (isBrandChecked || activeSubs.length > 0) ? 'var(--text)' : 'var(--text-muted)' }}>{marca}</span>
                </label>
                {subcats.length > 0 && (
                  <span 
                    onClick={() => toggleExpand(marca)}
                    style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1', padding: '0 5px' }}
                  >
                    {isExpanded ? '−' : '+'}
                  </span>
                )}
              </div>
              
              {isExpanded && subcats.map(sub => (
                <label key={sub} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '1.8rem' }}>
                  <input 
                    type="checkbox" 
                    checked={activeSubs.includes(sub as string)}
                    onChange={() => toggleSub(marca, sub as string)}
                    style={{ accentColor: 'var(--primary)', width: '14px', height: '14px' }}
                  />
                  <span style={{ color: activeSubs.includes(sub as string) ? 'var(--text)' : 'var(--text-muted)' }}>{sub as string}</span>
                </label>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ClientCatalog({ productos }: { productos: Product[] }) {
  // Estados para cada filtro
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
  const [selectedMarcaSubs, setSelectedMarcaSubs] = useState<Record<string, string[]>>({});
  const [selectedGamas, setSelectedGamas] = useState<string[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [selectedMascotas, setSelectedMascotas] = useState<string[]>([]);
  const [selectedEdades, setSelectedEdades] = useState<string[]>([]);
  const [selectedTamanos, setSelectedTamanos] = useState<string[]>([]);
  const [selectedNecesidades, setSelectedNecesidades] = useState<string[]>([]);
  const [selectedSabores, setSelectedSabores] = useState<string[]>([]);
  
  // Estado para ordenación
  const [sortBy, setSortBy] = useState<string>('alfabetico');
  

  // Listas únicas para construir el menú
  const categorias = useMemo(() => Array.from(new Set(productos.map(p => p.familia).filter(Boolean))).sort(), [productos]);
  const mascotas = useMemo(() => Array.from(new Set(productos.map(p => p.mascota).filter(Boolean))).sort(), [productos]);
  const edades = useMemo(() => Array.from(new Set(productos.map(p => p.edad).filter(Boolean))).sort(), [productos]);
  const tamanos = useMemo(() => Array.from(new Set(productos.map(p => p.tamano).filter(Boolean))).sort(), [productos]);
  const necesidades = useMemo(() => Array.from(new Set(productos.map(p => p.necesidad_especial).filter(Boolean))).filter(n => n !== 'Ninguna').sort(), [productos]);
  const sabores = useMemo(() => Array.from(new Set(productos.map(p => p.sabor_principal).filter(Boolean))).sort(), [productos]);

  // Manejador genérico de toggles
  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev: string[]) => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);
  };

  // Filtrado y ordenación de productos
  const productosFiltrados = useMemo(() => {
    const filtered = productos.filter(p => {
      const matchInArray = (arr: string[], val: string) => {
        if (arr.length === 0) return true;
        if (!val) return false;
        return arr.map(s => s.trim().toLowerCase()).includes(val.trim().toLowerCase());
      };

      if (!matchInArray(selectedCategorias, p.familia)) return false;
      if (!matchInArray(selectedGamas, p.gama)) return false;
      if (!matchInArray(selectedMascotas, p.mascota)) return false;
      if (!matchInArray(selectedEdades, p.edad)) return false;
      if (!matchInArray(selectedTamanos, p.tamano)) return false;
      if (!matchInArray(selectedNecesidades, p.necesidad_especial)) return false;
      if (!matchInArray(selectedSabores, p.sabor_principal)) return false;
      
      // Lógica anidada para Marca y Subcategoría (Pestañas/Desplegable)
      const brandHasAnySelection = selectedMarcas.length > 0 || Object.values(selectedMarcaSubs).some(arr => arr.length > 0);
      if (brandHasAnySelection) {
        const subsForThisBrand = selectedMarcaSubs[p.marca] || [];
        const nestedVal = p.gama || p.subcategoria;
        if (selectedMarcas.includes(p.marca) && subsForThisBrand.length === 0) {
          // Brand selected entirely
        } else if (nestedVal && subsForThisBrand.includes(nestedVal)) {
          // Specific subcategory selected
        } else {
          return false;
        }
      }
      
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'precio_asc') return (Number(a.precio_pvp) || 0) - (Number(b.precio_pvp) || 0);
      if (sortBy === 'precio_desc') return (Number(b.precio_pvp) || 0) - (Number(a.precio_pvp) || 0);
      if (sortBy === 'sabor') return (a.sabor_principal || '').localeCompare(b.sabor_principal || '');
      // 'alfabetico' por defecto
      return (a.nombre || '').localeCompare(b.nombre || '');
    });
  }, [productos, selectedMarcas, selectedMarcaSubs, selectedGamas, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, sortBy]);

  if (productos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        <h2>Aún no hay productos disponibles.</h2>
        <p>Desde el TPV asigna productos a la familia correcta.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative' }}>
      
      {/* Sidebar de Filtros Moderno */}
      <aside style={{ 
        width: '260px', flexShrink: 0, position: 'sticky', top: '20px', 
        backgroundColor: 'var(--surface)', padding: '1.5rem', 
        borderRadius: 'var(--radius)', border: '1px solid var(--border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        maxHeight: 'calc(100vh - 40px)', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Filtros</h3>
          <button 
            onClick={() => {
              setSelectedMarcas([]); setSelectedMarcaSubs({}); setSelectedGamas([]); setSelectedCategorias([]); setSelectedMascotas([]);
              setSelectedEdades([]); setSelectedTamanos([]); setSelectedNecesidades([]); setSelectedSabores([]);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
          >
            Limpiar todo
          </button>
        </div>
        
        <FilterSection title="Mascota" options={mascotas} state={selectedMascotas} setter={setSelectedMascotas} onToggle={toggle} defaultExpanded={true} />
        <FilterSection title="Categoría" options={categorias} state={selectedCategorias} setter={setSelectedCategorias} onToggle={toggle} defaultExpanded={true} />
        <FilterSection title="Edad" options={edades} state={selectedEdades} setter={setSelectedEdades} onToggle={toggle} />
        <FilterSection title="Tamaño" options={tamanos} state={selectedTamanos} setter={setSelectedTamanos} onToggle={toggle} />
        <FilterSection title="Necesidad Especial" options={necesidades} state={selectedNecesidades} setter={setSelectedNecesidades} onToggle={toggle} />
        <FilterSection title="Sabor" options={sabores} state={selectedSabores} setter={setSelectedSabores} onToggle={toggle} />
        
        <BrandFilterSection 
          productos={productos} 
          selectedMarcas={selectedMarcas} 
          setSelectedMarcas={setSelectedMarcas} 
          selectedMarcaSubs={selectedMarcaSubs} 
          setSelectedMarcaSubs={setSelectedMarcaSubs} 
        />
      </aside>

      {/* Grid de Productos Moderno */}
      <div style={{ flexGrow: 1 }}>
        {productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
            <h3 style={{ marginBottom: '1rem' }}>No hay productos que coincidan con estos filtros</h3>
            <p style={{ color: 'var(--text-muted)' }}>Prueba a quitar alguna selección.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>
                Mostrando {productosFiltrados.length} resultados
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ordenar por:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ 
                    padding: '0.5rem', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)', 
                    backgroundColor: 'var(--surface)', 
                    color: 'var(--text)',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="alfabetico">Alfabético (A-Z)</option>
                  <option value="sabor">Proteína / Sabor</option>
                  <option value="precio_asc">Precio (Menor a Mayor)</option>
                  <option value="precio_desc">Precio (Mayor a Menor)</option>
                </select>
              </div>
            </div>
            <div className="grid" style={{ padding: 0 }}>
              {productosFiltrados.map((prod) => (
                <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s', border: '1px solid var(--border)' }}>
                  
                  {/* Contenedor de Imagen con el SKU correcto */}
                  <div style={{ 
                    position: 'relative',
                    height: '220px', 
                    padding: '1rem',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid var(--surface-hover)'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: prod.sku 
                        ? `url("/images/productos/${encodeURIComponent(prod.sku)}.jpg"), url("/placeholder.png")` 
                        : `url("/placeholder.png")`, 
                      backgroundSize: 'contain', 
                      backgroundRepeat: 'no-repeat', 
                      backgroundPosition: 'center',
                    }} 
                    />
                    {prod.marca && prod.marca !== 'Genérico' && prod.marca !== 'Servicio' && (
                       <span style={{ 
                         position: 'absolute', top: '10px', left: '10px', 
                         background: 'var(--primary)', color: 'white', 
                         padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
                       }}>
                         {prod.marca}
                       </span>
                    )}
                  </div>

                  {/* Info del Producto */}
                  <div className="card-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '1.25rem' }}>
                    <div className="card-title" style={{ fontSize: '1rem', lineHeight: '1.3', marginBottom: '0.5rem', fontWeight: '600' }}>
                      {prod.nombre}
                    </div>
                    
                    {/* Tags (Edad, Tamaño, Sabor...) */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
                      {prod.mascota && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px'}}>{prod.mascota}</span>}
                      {prod.gama && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px', border: '1px solid var(--border)'}}>{prod.gama}</span>}
                      {prod.edad && prod.edad !== 'Todas' && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px'}}>{prod.edad}</span>}
                      {prod.necesidad_especial && prod.necesidad_especial !== 'Ninguna' && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px', color: 'var(--primary)'}}>{prod.necesidad_especial}</span>}
                    </div>

                    {/* Características Extra */}
                    {prod.caracteristicas && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
                        {prod.caracteristicas}
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="card-price" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)' }}>
                        {prod.precio_pvp ? Number(prod.precio_pvp).toFixed(2) : '0.00'} €
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '1rem' }}>
                      <AddToCartBtn product={prod} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
