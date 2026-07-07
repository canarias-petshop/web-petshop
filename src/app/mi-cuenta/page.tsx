"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, User, Gift, PawPrint, Calendar, Scissors, Info, Package, Clock } from "lucide-react";

export default function MiCuentaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [clienteData, setClienteData] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/login");
          return;
        }

        setUser(user);

        // Fetch client data bypassing RLS using API
        const profileRes = await fetch('/api/user/profile');
        let clientDataResult = null;
        if (profileRes.ok) {
          const profileJson = await profileRes.json();
          clientDataResult = profileJson.clientData;
          
          if (!clientDataResult && user.email) {
            // Si no se encontró por auth_user_id, llamamos al linker
            try {
              const linkRes = await fetch('/api/user/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, auth_user_id: user.id })
              });
              if (linkRes.ok) {
                const linkData = await linkRes.json();
                if (linkData.linked) {
                  const retryRes = await fetch('/api/user/profile');
                  if (retryRes.ok) {
                    const retryJson = await retryRes.json();
                    clientDataResult = retryJson.clientData;
                  }
                }
              }
            } catch (err) {
              console.error("Error en auto-link:", err);
            }
          }  
        }
        
        if (clientDataResult) {
          setClienteData(clientDataResult);
          
          // Fetch user orders (pedidos)
          if (clientDataResult.telefono || user.user_metadata?.telefono) {
            const tel = clientDataResult.telefono || user.user_metadata?.telefono;
            const { data: pedidosData } = await supabase
              .from("encargos_clientes")
              .select("*")
              .eq("telefono", tel)
              .order("created_at", { ascending: false });
              
            if (pedidosData) {
              setPedidos(pedidosData);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Cargando tus datos...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Mi Cuenta
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            ¡Hola, {clienteData ? clienteData.nombre_dueno : user.user_metadata?.nombre || 'Amigo'}!
          </p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', padding: '0.75rem 1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>

      {!clienteData && (
        <div style={{ backgroundColor: '#fffbeb', color: '#b45309', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', border: '1px solid #fde68a' }}>
          <Info size={24} />
          <div>
            <strong>Ficha en revisión:</strong> Tu cuenta web está creada pero estamos vinculándola con tu ficha de la tienda física. Tus puntos y mascotas aparecerán aquí muy pronto.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Card: Perfil */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--background)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
              <User size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Mis Datos</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
            <div>
              <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, opacity: 0.7 }}>Nombre</p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{clienteData?.nombre || user.user_metadata?.nombre}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, opacity: 0.7 }}>Email</p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{user.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, opacity: 0.7 }}>Teléfono</p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{clienteData?.telefono || user.user_metadata?.telefono}</p>
            </div>
          </div>
        </div>

        {/* Card: Puntos */}
        <div style={{ backgroundColor: 'var(--primary)', padding: '2rem', borderRadius: 'var(--radius)', color: 'white', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '12px' }}>
              <Gift size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Animalarium Club</h2>
          </div>
          <div>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.25rem' }}>Puntos Acumulados</p>
            <p style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>{clienteData?.puntos || 0}</p>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
            Enseña tu ficha en caja para canjear tus puntos por descuentos.
          </p>
        </div>
      </div>

      {/* Pedidos Section */}
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Package color="var(--primary)" />
        Histórico de Pedidos
      </h2>

      {pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1.1rem' }}>Aún no has realizado ningún pedido web.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {pedidos.map((pedido) => (
            <div key={pedido.id} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pedido #{pedido.id}</span>
                    <span style={{ fontSize: '0.8rem', backgroundColor: pedido.estado === 'Entregado' ? '#dcfce7' : '#fef9c3', color: pedido.estado === 'Entregado' ? '#166534' : '#854d0e', padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                      {pedido.estado || 'Pendiente'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={14} />
                    {new Date(pedido.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {pedido.origen && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, border: '1px solid var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                    {pedido.origen}
                  </div>
                )}
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {pedido.detalle_pedido}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mascotas Section */}
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <PawPrint color="var(--primary)" />
        Mis Mascotas
      </h2>

      {(!clienteData?.mascotas || clienteData.mascotas.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
          <PawPrint size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1.1rem' }}>No tienes mascotas registradas aún.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Las mascotas que registres en la tienda aparecerán aquí.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '1.5rem' }}>
          {clienteData.mascotas.map((mascota: any) => (
            <div key={mascota.id} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                    {mascota.nombre}
                  </h3>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {mascota.especie} {mascota.raza ? `• ${mascota.raza}` : ''}
                  </p>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {mascota.citas && mascota.citas.length > 0 ? (
                  <>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Scissors size={16} color="var(--secondary)" /> 
                      Historial de Peluquería
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {mascota.citas.slice(0, 3).map((cita: any) => (
                        <div key={cita.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '8px' }}>
                          <Calendar size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{new Date(cita.fecha_hora).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {cita.servicio}
                            </p>
                          </div>
                        </div>
                      ))}
                      {mascota.citas.length > 3 && (
                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500, cursor: 'pointer' }}>
                          Ver {mascota.citas.length - 3} citas anteriores
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>
                    No hay citas de peluquería recientes.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
