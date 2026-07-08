'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import AddToCartBtn from '@/components/AddToCartBtn';
import { Search, Filter, X } from 'lucide-react';

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
  categoria_web?: string;
  subcategoria_web?: string;
};

// Componente reutilizable para renderizar cada bloque de checkboxes (Acordeón)
function FilterSection({ title, options, state, setter, onToggle, counts, defaultExpanded = false }: { title: string, options: string[], state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, onToggle: (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => void, counts: Record<string, number>, defaultExpanded?: boolean }) {
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
          {options.map(opt => {
            const count = counts[opt] || 0;
            const isSelected = state.includes(opt);
            if (count === 0 && !isSelected) return null;
            return (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', opacity: count === 0 ? 0.5 : 1 }}>
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => onToggle(setter, opt)}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                <span style={{ color: isSelected ? 'var(--text)' : 'var(--text-muted)' }}>{opt} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({count})</span></span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Componente para filtro anidado de marcas
function BrandFilterSection({ productos, selectedMarcas, setSelectedMarcas, selectedMarcaSubs, setSelectedMarcaSubs, counts }: { productos: Product[], selectedMarcas: string[], setSelectedMarcas: React.Dispatch<React.SetStateAction<string[]>>, selectedMarcaSubs: Record<string, string[]>, setSelectedMarcaSubs: React.Dispatch<React.SetStateAction<Record<string, string[]>>>, counts: Record<string, number> }) {
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
  
  const brandsObj = useMemo(() => {
    const obj: Record<string, Set<string>> = {};
    for (const p of productos) {
      if (!p.marca) continue;
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
      setSelectedMarcaSubs((prev) => ({ ...prev, [marca]: [] }));
    } else {
      setSelectedMarcas((prev: string[]) => [...prev, marca]);
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
    
    if (newSubs.length > 0 && selectedMarcas.includes(marca)) {
      setSelectedMarcas((prev: string[]) => prev.filter(m => m !== marca));
    }
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
          const count = counts[marca] || 0;
          
          if (count === 0 && !isBrandChecked && activeSubs.length === 0) return null;
          
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
                  <span style={{ color: (isBrandChecked || activeSubs.length > 0) ? 'var(--text)' : 'var(--text-muted)' }}>{marca} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({count})</span></span>
                </label>
                {subcats.length > 0 && (
                  <span 
                    onClick={() => setExpandedBrands(prev => prev.includes(marca) ? prev.filter(m => m !== marca) : [...prev, marca])}
                    style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1', padding: '0 5px' }}
                  >
                    {isExpanded ? '−' : '+'}
                  </span>
                )}
              </div>
              
              {isExpanded && subcats.map(sub => {
                const subCount = counts[sub as string] || 0;
                const isSubChecked = activeSubs.includes(sub as string);
                if (subCount === 0 && !isSubChecked) return null;
                return (
                  <label key={sub} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '1.8rem' }}>
                    <input 
                      type="checkbox" 
                      checked={isSubChecked}
                      onChange={() => toggleSub(marca, sub as string)}
                      style={{ accentColor: 'var(--primary)', width: '14px', height: '14px' }}
                    />
                    <span style={{ color: isSubChecked ? 'var(--text)' : 'var(--text-muted)' }}>{sub as string} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({subCount})</span></span>
                  </label>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ClientCatalog({ productos }: { productos: Product[] }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';
  const initialCat = searchParams?.get('categoria');

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Cross-sell states
  const [crossSellTarget, setCrossSellTarget] = useState<Product | null>(null);
  const [showCrossSell, setShowCrossSell] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get('search');
      if (search !== null) {
        setSearchQuery(search);
      }
      const cat = searchParams.get('categoria');
      if (cat !== null) {
        setSelectedCategorias([cat]);
      }
    }
  }, [searchParams]);

  const productosFormateados = useMemo(() => {
    return productos
      .filter(p => p.marca !== 'Genérico' && p.marca !== 'Generico' && p.marca !== 'Servicio')
      .filter(p => (p.familia === 'Alimentación' || p.familia === 'Alimentacion') && p.imagen_url && p.imagen_url.trim() !== '')
      .map(p => {
        let marcaFormateada = p.marca;
        if (marcaFormateada && marcaFormateada.toLowerCase() === 'atlantic pet') {
          marcaFormateada = 'ATLANTIC PET';
        }
        
        let catFinal = p.familia || 'Otros';
        let subcatFinal = p.subcategoria || '';

        return { ...p, marca: marcaFormateada, categoria_web: catFinal, subcategoria_web: subcatFinal };
      });
  }, [productos]);

  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
  const [selectedMarcaSubs, setSelectedMarcaSubs] = useState<Record<string, string[]>>({});
  const [selectedGamas, setSelectedGamas] = useState<string[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>(initialCat ? [initialCat] : []);
  const [selectedSubcategorias, setSelectedSubcategorias] = useState<string[]>([]);
  const [selectedMascotas, setSelectedMascotas] = useState<string[]>([]);
  const [selectedEdades, setSelectedEdades] = useState<string[]>([]);
  const [selectedTamanos, setSelectedTamanos] = useState<string[]>([]);
  const [selectedNecesidades, setSelectedNecesidades] = useState<string[]>([]);
  const [selectedSabores, setSelectedSabores] = useState<string[]>([]);
  
  const [sortBy, setSortBy] = useState<string>('alfabetico');
  
  const categorias = useMemo(() => (Array.from(new Set(productosFormateados.map(p => p.categoria_web).filter(Boolean))) as string[]).sort(), [productosFormateados]);
  const subcategorias = useMemo(() => (Array.from(new Set(productosFormateados.map(p => p.subcategoria_web).filter(Boolean))) as string[]).sort(), [productosFormateados]);
  const mascotas = useMemo(() => (Array.from(new Set(productosFormateados.map(p => p.mascota).filter(Boolean))) as string[]).sort(), [productosFormateados]);
  const edades = useMemo(() => (Array.from(new Set(productosFormateados.map(p => p.edad).filter(Boolean))) as string[]).sort(), [productosFormateados]);
  const tamanos = useMemo(() => (Array.from(new Set(productosFormateados.map(p => p.tamano).filter(Boolean))) as string[]).sort(), [productosFormateados]);
  const necesidades = useMemo(() => (Array.from(new Set(productosFormateados.map(p => p.necesidad_especial).filter(Boolean))) as string[]).filter(n => n !== 'Ninguna').sort(), [productosFormateados]);
  const sabores = useMemo(() => (Array.from(new Set(productosFormateados.map(p => p.sabor_principal).filter(Boolean))) as string[]).sort(), [productosFormateados]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev: string[]) => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);
  };

  // Función para obtener cuentas reactivas omitiendo una categoría concreta
  const getCounts = (skipCategory: string) => {
    return productosFormateados.filter(p => {
      const matchInArray = (arr: string[], val?: string) => {
        if (arr.length === 0) return true;
        if (!val) return false;
        return arr.map(s => s.trim().toLowerCase()).includes(val.trim().toLowerCase());
      };

      if (skipCategory !== 'categoria' && !matchInArray(selectedCategorias, p.categoria_web)) return false;
      if (skipCategory !== 'subcategoria' && !matchInArray(selectedSubcategorias, p.subcategoria_web)) return false;
      if (skipCategory !== 'mascota' && !matchInArray(selectedMascotas, p.mascota)) return false;
      if (skipCategory !== 'edad' && !matchInArray(selectedEdades, p.edad)) return false;
      if (skipCategory !== 'tamano' && !matchInArray(selectedTamanos, p.tamano)) return false;
      if (skipCategory !== 'necesidad' && !matchInArray(selectedNecesidades, p.necesidad_especial)) return false;
      if (skipCategory !== 'sabor' && !matchInArray(selectedSabores, p.sabor_principal)) return false;
      
      if (skipCategory !== 'marca') {
        const brandHasAnySelection = selectedMarcas.length > 0 || Object.values(selectedMarcaSubs).some(arr => arr.length > 0);
        if (brandHasAnySelection) {
          const subsForThisBrand = p.marca ? (selectedMarcaSubs[p.marca] || []) : [];
          const nestedVal = p.gama || p.subcategoria;
          if (p.marca && selectedMarcas.includes(p.marca) && subsForThisBrand.length === 0) {
          } else if (nestedVal && subsForThisBrand.includes(nestedVal)) {
          } else {
            return false;
          }
        }
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!p.nombre?.toLowerCase().includes(query) && !p.sku?.toLowerCase().includes(query) && !p.marca?.toLowerCase().includes(query)) return false;
      }
      
      return true;
    }).reduce((acc, p) => {
      if (skipCategory === 'categoria' && p.categoria_web) acc[p.categoria_web] = (acc[p.categoria_web] || 0) + 1;
      if (skipCategory === 'mascota' && p.mascota) acc[p.mascota] = (acc[p.mascota] || 0) + 1;
      if (skipCategory === 'edad' && p.edad) acc[p.edad] = (acc[p.edad] || 0) + 1;
      if (skipCategory === 'tamano' && p.tamano) acc[p.tamano] = (acc[p.tamano] || 0) + 1;
      if (skipCategory === 'necesidad' && p.necesidad_especial) acc[p.necesidad_especial] = (acc[p.necesidad_especial] || 0) + 1;
      if (skipCategory === 'sabor' && p.sabor_principal) acc[p.sabor_principal] = (acc[p.sabor_principal] || 0) + 1;
      if (skipCategory === 'marca' && p.marca) {
        acc[p.marca] = (acc[p.marca] || 0) + 1;
        const nestedVal = p.gama || p.subcategoria;
        if (nestedVal) acc[nestedVal] = (acc[nestedVal] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const countsCategoria = useMemo(() => getCounts('categoria'), [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, searchQuery]);
    const countsSubcategoria = useMemo(() => getCounts('subcategoria'), [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, searchQuery]);
  const countsMascota = useMemo(() => getCounts('mascota'), [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, searchQuery]);
  const countsEdad = useMemo(() => getCounts('edad'), [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, searchQuery]);
  const countsTamano = useMemo(() => getCounts('tamano'), [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, searchQuery]);
  const countsNecesidad = useMemo(() => getCounts('necesidad'), [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, searchQuery]);
  const countsSabor = useMemo(() => getCounts('sabor'), [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, searchQuery]);
  const countsMarca = useMemo(() => getCounts('marca'), [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, searchQuery]);

  const productosFiltrados = useMemo(() => {
    const filtered = productosFormateados.filter(p => {
      const matchInArray = (arr: string[], val?: string) => {
        if (arr.length === 0) return true;
        if (!val) return false;
        return arr.map(s => s.trim().toLowerCase()).includes(val.trim().toLowerCase());
      };

      if (!matchInArray(selectedCategorias, p.categoria_web)) return false;
      if (!matchInArray(selectedMascotas, p.mascota)) return false;
      if (!matchInArray(selectedEdades, p.edad)) return false;
      if (!matchInArray(selectedTamanos, p.tamano)) return false;
      if (!matchInArray(selectedNecesidades, p.necesidad_especial)) return false;
      if (!matchInArray(selectedSabores, p.sabor_principal)) return false;
      
      const brandHasAnySelection = selectedMarcas.length > 0 || Object.values(selectedMarcaSubs).some(arr => arr.length > 0);
      if (brandHasAnySelection) {
        const subsForThisBrand = p.marca ? (selectedMarcaSubs[p.marca] || []) : [];
        const nestedVal = p.gama || p.subcategoria;
        if (p.marca && selectedMarcas.includes(p.marca) && subsForThisBrand.length === 0) {
        } else if (nestedVal && subsForThisBrand.includes(nestedVal)) {
        } else {
          return false;
        }
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!p.nombre?.toLowerCase().includes(query) && !p.sku?.toLowerCase().includes(query) && !p.marca?.toLowerCase().includes(query)) return false;
      }
      
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'precio_asc') return (Number(a.precio_pvp) || 0) - (Number(b.precio_pvp) || 0);
      if (sortBy === 'precio_desc') return (Number(b.precio_pvp) || 0) - (Number(a.precio_pvp) || 0);
      if (sortBy === 'sabor') return (a.sabor_principal || '').localeCompare(b.sabor_principal || '');
      return (a.nombre || '').localeCompare(b.nombre || '');
    });
  }, [productosFormateados, selectedMarcas, selectedMarcaSubs, selectedCategorias, selectedSubcategorias, selectedMascotas, selectedEdades, selectedTamanos, selectedNecesidades, selectedSabores, sortBy, searchQuery]);

  if (productosFormateados.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        <h2>Aún no hay productos disponibles.</h2>
        <p>Desde el TPV asigna productos a la familia correcta.</p>
      </div>
    );
  }

  return (
    <div className="catalog-layout">
      
      {/* Botón flotante para móvil */}
      <button 
        className="mobile-filter-btn btn btn-primary"
        onClick={() => setIsMobileFiltersOpen(true)}
        style={{ display: 'none', marginBottom: '1rem', width: '100%', justifyContent: 'center', gap: '0.5rem' }}
      >
        <Filter size={18} /> Filtros y Búsqueda
      </button>

      {/* Sidebar de Filtros */}
      <aside className={`catalog-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Filtros</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => {
                setSelectedMarcas([]); setSelectedMarcaSubs({}); setSelectedGamas([]); setSelectedCategorias([]); setSelectedSubcategorias([]); setSelectedMascotas([]);
                setSelectedEdades([]); setSelectedTamanos([]); setSelectedNecesidades([]); setSelectedSabores([]); setSearchQuery('');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
            >
              Limpiar
            </button>
            <button className="mobile-close-btn" onClick={() => setIsMobileFiltersOpen(false)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
              <X size={24} />
            </button>
          </div>
        </div>
        
        <FilterSection title="Mascota" options={mascotas} state={selectedMascotas} setter={setSelectedMascotas} onToggle={toggle} counts={countsMascota} defaultExpanded={true} />
        <FilterSection title="Categoría" options={categorias} state={selectedCategorias} setter={setSelectedCategorias} onToggle={toggle} counts={countsCategoria} defaultExpanded={true} />
        <FilterSection title="Subcategoría" options={subcategorias} state={selectedSubcategorias} setter={setSelectedSubcategorias} onToggle={toggle} counts={countsSubcategoria} defaultExpanded={true} />
        <FilterSection title="Edad" options={edades} state={selectedEdades} setter={setSelectedEdades} onToggle={toggle} counts={countsEdad} />
        <FilterSection title="Tamaño" options={tamanos} state={selectedTamanos} setter={setSelectedTamanos} onToggle={toggle} counts={countsTamano} />
        <FilterSection title="Necesidad Especial" options={necesidades} state={selectedNecesidades} setter={setSelectedNecesidades} onToggle={toggle} counts={countsNecesidad} />
        <FilterSection title="Sabor" options={sabores} state={selectedSabores} setter={setSelectedSabores} onToggle={toggle} counts={countsSabor} />
        
        <BrandFilterSection 
          productos={productosFormateados} 
          selectedMarcas={selectedMarcas} 
          setSelectedMarcas={setSelectedMarcas} 
          selectedMarcaSubs={selectedMarcaSubs} 
          setSelectedMarcaSubs={setSelectedMarcaSubs} 
          counts={countsMarca}
        />
      </aside>

      {/* Grid de Productos */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div className="catalog-top-bar" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          
          <div style={{ position: 'relative', flexGrow: 1, maxWidth: '500px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar productos, marca, referencia..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', boxShadow: 'var(--shadow-sm)' }}
            />
            {searchQuery && (
              <X size={16} onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }} />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Ordenar por:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', outline: 'none', boxShadow: 'var(--shadow-sm)' }}
            >
              <option value="alfabetico">Alfabético (A-Z)</option>
              <option value="sabor">Proteína / Sabor</option>
              <option value="precio_asc">Precio (Menor a Mayor)</option>
              <option value="precio_desc">Precio (Mayor a Menor)</option>
            </select>
          </div>
        </div>

        {productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
            <h3 style={{ marginBottom: '1rem' }}>No hay productos que coincidan con tu búsqueda</h3>
            <p style={{ color: 'var(--text-muted)' }}>Prueba a usar palabras diferentes o quitar filtros.</p>
          </div>
        ) : (
          <div>
            <div style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              Mostrando {productosFiltrados.length} resultados
            </div>
            <div className="grid" style={{ padding: 0 }}>
              {productosFiltrados.map((prod) => {
                const isCaja = prod.nombre?.toLowerCase().includes('caja');
                const originalPrice = Number(prod.precio_pvp) || 0;
                const finalPrice = isCaja ? originalPrice * 0.93 : originalPrice;

                return (
                <div 
                  key={prod.id} 
                  className="card" 
                  style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s', border: '1px solid var(--border)' }}
                  onMouseEnter={() => {
                    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                    hoverTimerRef.current = setTimeout(() => {
                      setCrossSellTarget(prod);
                      setShowCrossSell(true);
                    }, 5000);
                  }}
                  onMouseLeave={() => {
                    if (hoverTimerRef.current) {
                      clearTimeout(hoverTimerRef.current);
                      hoverTimerRef.current = null;
                    }
                  }}
                >
                  
                  <div style={{ position: 'relative', height: '160px', padding: '0.5rem', backgroundColor: '#ffffff', borderBottom: '1px solid var(--surface-hover)' }}>
                    <div style={{
                      width: '100%', height: '100%',
                      backgroundImage: prod.sku 
                        ? `url("/images/productos/${encodeURIComponent(prod.sku)}.jpg")` 
                        : `url("/placeholder.png")`, 
                      backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                    }} />
                    {prod.marca && (
                       <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                         {prod.marca}
                       </span>
                    )}
                    {isCaja && (
                       <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#e74c3c', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                         -7% DTO. CAJA
                       </span>
                    )}
                  </div>

                  <div className="card-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div className="card-title" style={{ fontSize: '1rem', lineHeight: '1.2', marginBottom: '0.25rem', fontWeight: '600' }}>
                      {prod.nombre}
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.25rem' }}>
                      {prod.mascota && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px'}}>{prod.mascota}</span>}
                      {prod.gama && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px', border: '1px solid var(--border)'}}>{prod.gama}</span>}
                      {prod.edad && prod.edad !== 'Todas' && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px'}}>{prod.edad}</span>}
                      {prod.necesidad_especial && prod.necesidad_especial !== 'Ninguna' && <span style={{fontSize: '0.7rem', padding: '2px 6px', background: 'var(--surface-hover)', borderRadius: '4px', color: 'var(--primary)'}}>{prod.necesidad_especial}</span>}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', lineHeight: '1.3', flexGrow: 1 }}>
                      {prod.caracteristicas && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          {prod.caracteristicas}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="card-price" style={{ display: 'flex', flexDirection: 'column' }}>
                        {isCaja && (
                           <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                             {originalPrice.toFixed(2)} €
                           </span>
                        )}
                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: isCaja ? '#e74c3c' : 'var(--text)' }}>
                          {finalPrice.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '0.5rem' }}>
                      <AddToCartBtn product={{...prod, precio: finalPrice, precio_pvp: finalPrice}} />
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>

      {showCrossSell && crossSellTarget && (
        <CrossSellPopup 
          targetProduct={crossSellTarget} 
          allProducts={productosFormateados} 
          onClose={() => { setShowCrossSell(false); setCrossSellTarget(null); }} 
        />
      )}
    </div>
  );
}

function CrossSellPopup({ targetProduct, allProducts, onClose }: { targetProduct: Product, allProducts: Product[], onClose: () => void }) {
  const suggestedProducts = useMemo(() => {
    const sameMascota = allProducts.filter(p => p.id !== targetProduct.id && p.mascota === targetProduct.mascota);
    let complements = sameMascota.filter(p => p.categoria_web !== targetProduct.categoria_web);
    if (complements.length === 0) complements = sameMascota;
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/purity
    const shuffled = [...complements].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [targetProduct, allProducts]);

  if (suggestedProducts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: 'min(280px, 70vw)',
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-lg)',
      border: '2px solid var(--primary)',
      zIndex: 9999,
      padding: '1rem',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
      >
        <X size={20} />
      </button>
      
      <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '0.95rem', paddingRight: '20px', lineHeight: 1.2 }}>
        ¿Has visto esto para {targetProduct.mascota || 'tu mascota'}?
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {suggestedProducts.map(sp => {
          const originalPrice = Number(sp.precio_pvp) || 0;
          const isCaja = sp.nombre?.toLowerCase().includes('caja');
          const finalPrice = isCaja ? originalPrice * 0.93 : originalPrice;
          
          return (
            <div key={sp.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{
                width: '60px', height: '60px', flexShrink: 0,
                backgroundImage: sp.sku ? `url("/images/productos/${encodeURIComponent(sp.sku)}.jpg")` : `url("/placeholder.png")`,
                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'
              }} />
              <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sp.nombre}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}>
                    {finalPrice.toFixed(2)} €
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => {
                        window.location.href = `/catalogo?search=${encodeURIComponent(sp.sku || sp.nombre)}`;
                      }}
                      style={{
                        backgroundColor: 'var(--surface-hover)',
                        color: 'var(--primary)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        border: '1px solid var(--primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      VER
                    </button>
                    <AddToCartBtn product={{...sp, precio: finalPrice, precio_pvp: finalPrice}} mini={true} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
