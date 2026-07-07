"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle, AlertCircle, MapPin, Truck, ShoppingBag, CreditCard, Gift, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  
  const [user, setUser] = useState<any>(null);
  const [clienteData, setClienteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [esPrimeraCompra, setEsPrimeraCompra] = useState(false);
  const [showWeekendWarning, setShowWeekendWarning] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    notas: "",
  });
  
  // Checkout options state
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta (Enlace de Pago)");
  const [deliveryMethod, setDeliveryMethod] = useState("Recogida en tienda");
  const [shippingZone, setShippingZone] = useState("cercania"); // 'cercania' (5€) o 'lejos' (10€)
  
  // Points state
  const [usePoints, setUsePoints] = useState(false);
  
  // Fetch user data
  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: clientData } = await supabase
            .from("clientes")
            .select("*")
            .eq("auth_user_id", user.id)
            .single();
            
          if (clientData) {
            setClienteData(clientData);
            setFormData(prev => ({
              ...prev,
              nombre: clientData.nombre || user.user_metadata?.nombre || "",
              telefono: clientData.telefono || user.user_metadata?.telefono || "",
              direccion: clientData.direccion || ""
            }));
          } else {
             setFormData(prev => ({
              ...prev,
              nombre: user.user_metadata?.nombre || "",
              telefono: user.user_metadata?.telefono || "",
            }));
          }

          // Check if first purchase
          const { count } = await supabase
            .from("encargos_clientes")
            .select("*", { count: 'exact', head: true })
            .eq("auth_user_id", user.id)
            .neq("estado", "Cancelado");
            
          if (count === 0) {
            setEsPrimeraCompra(true);
          }

        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    // Redirect if cart is empty
    if (items.length === 0 && !success) {
      router.push("/catalogo");
    } else {
      loadUser();
    }
    
    // Check for weekend warning (Thursday 20:00 to Sunday 23:59)
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    if (day === 6 || day === 0 || day === 5 || (day === 4 && hour >= 20)) {
      setShowWeekendWarning(true);
    }
  }, [items, router, success]);

  // Shipping calculation
  const isFreeShipping = total >= 110;
  
  let shippingCost = 0;
  if (deliveryMethod === 'Envío a domicilio' && !isFreeShipping) {
    shippingCost = shippingZone === 'cercania' ? 5 : 10;
  }

  // Points calculation logic (1 pt = 0.50€, max 50% of total)
  const puntosDisponibles = clienteData?.puntos || 0;
  const maxDescuentoPermitido = total * 0.50;
  const maxPuntosPermitidos = Math.floor(maxDescuentoPermitido / 0.50);
  
  const puntosAAplicar = usePoints ? Math.min(puntosDisponibles, maxPuntosPermitidos) : 0;
  const descuentoPuntos = puntosAAplicar * 0.50;
  
  // Descuento primera compra (10% sobre productos)
  const descuentoPrimeraCompra = esPrimeraCompra ? (total * 0.10) : 0;
  
  // Final total includes shipping and discounts
  const finalTotal = total - descuentoPrimeraCompra + shippingCost - descuentoPuntos;
  
  const puntosAGanar = Math.floor(finalTotal / 10); // 1 punto por cada 10€ gastados

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const payload = {
        items,
        cliente: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion,
        notas: formData.notas,
        metodo_pago: paymentMethod,
        metodo_entrega: deliveryMethod,
        zona_envio: shippingZone,
        coste_envio: shippingCost,
        auth_user_id: user?.id,
        email: user?.email,
        cliente_id: clienteData?.id,
        puntos_usados: puntosAAplicar,
        descuento_puntos: descuentoPuntos,
        puntos_ganados: puntosAGanar,
        descuento_primera_compra: descuentoPrimeraCompra,
        total_original: total,
        total_final: finalTotal
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al procesar el pedido');
      }
      
      setSuccess(true);
      clearCart();
      
    } catch (err) {
      console.error(err);
      alert("Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  if (success) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>¡Pedido Confirmado!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>
          Hemos recibido tu pedido correctamente en nuestra tienda. Lo estamos preparando y en breve nos pondremos en contacto contigo por WhatsApp para confirmar la disponibilidad y coordinar la entrega o el pago.
        </p>
        
        {paymentMethod === 'Bizum' && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', maxWidth: '500px' }}>
            <h3 style={{ color: '#166534', fontWeight: 'bold', marginBottom: '0.5rem' }}>Pago por Bizum</h3>
            <p style={{ color: '#15803d' }}>
              Nos pondremos en contacto contigo por WhatsApp para confirmar que tenemos todos tus artículos y te facilitaremos el número para enviar el Bizum de <strong>{finalTotal.toFixed(2)}€</strong>.
            </p>
          </div>
        )}

        {paymentMethod === 'Tarjeta (Enlace de Pago)' && (
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', maxWidth: '500px' }}>
            <h3 style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: '0.5rem' }}>Pago con Tarjeta</h3>
            <p style={{ color: '#1d4ed8' }}>
              Nos pondremos en contacto contigo por WhatsApp para confirmar tu pedido y te enviaremos un <strong>enlace de pago 100% seguro</strong> por valor de <strong>{finalTotal.toFixed(2)}€</strong>.
            </p>
          </div>
        )}
        

        <button className="btn btn-primary" onClick={() => router.push('/catalogo')}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '2rem' }}>Finalizar Compra</h1>
      
      {showWeekendWarning && (
        <div style={{ backgroundColor: '#fff7ed', color: '#c2410c', padding: '1rem 1.5rem', borderRadius: 'var(--radius)', border: '1px solid #fed7aa', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <AlertCircle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Aviso sobre el tiempo de entrega</strong>
            Los pedidos realizados a partir del jueves a las 20:00h o durante el fin de semana se entregarán <strong>entre el lunes y el martes</strong> de la siguiente semana (en caso de no disponer de stock en tienda).
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Formulario y Detalles de Envío/Pago */}
        <div style={{ flex: '1 1 min(100%, 600px)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {!user ? (
            <div style={{ backgroundColor: '#eff6ff', color: '#1e40af', padding: '2.5rem', borderRadius: 'var(--radius)', border: '1px solid #bfdbfe', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Identificación Requerida</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', maxWidth: '400px' }}>
                Para poder realizar un pedido de forma segura y acumular puntos en tu ficha de cliente, necesitas iniciar sesión o crear una cuenta gratuita.
              </p>
              <button className="btn btn-primary" onClick={() => router.push('/login')} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                Iniciar Sesión / Registrarse
              </button>
            </div>
          ) : (
            <>

          {/* Opciones de Entrega */}
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="var(--primary)" /> Método de Entrega
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', backgroundColor: deliveryMethod === 'Recogida en tienda' ? '#fdf2f8' : 'transparent', borderColor: deliveryMethod === 'Recogida en tienda' ? 'var(--primary)' : 'var(--border)' }}>
                <input type="radio" name="delivery" checked={deliveryMethod === 'Recogida en tienda'} onChange={() => setDeliveryMethod('Recogida en tienda')} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Recogida en tienda</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gratis - Calle José Hernández Alfonso 26</div>
                </div>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', backgroundColor: deliveryMethod === 'Envío a domicilio' ? '#fdf2f8' : 'transparent', borderColor: deliveryMethod === 'Envío a domicilio' ? 'var(--primary)' : 'var(--border)' }}>
                <input type="radio" name="delivery" checked={deliveryMethod === 'Envío a domicilio'} onChange={() => setDeliveryMethod('Envío a domicilio')} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Envío a domicilio</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Te lo llevamos a casa (Consultar disponibilidad según zona)</div>
                </div>
              </label>
            </div>
          </div>

          {/* Datos del Cliente */}
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--primary)" /> Tus Datos
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Nombre completo *</label>
                  <input type="text" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} placeholder="Tu nombre y apellidos" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Teléfono *</label>
                  <input type="tel" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} placeholder="600 000 000" />
                </div>
              </div>
              
              {deliveryMethod === 'Envío a domicilio' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Dirección de Entrega *</label>
                    <input type="text" required={deliveryMethod === 'Envío a domicilio'} value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} placeholder="Calle, número, código postal, localidad" />
                  </div>
                  
                  <div style={{ padding: '1rem', marginTop: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#1e40af' }}>Zona de Envío</label>
                    <select 
                      value={shippingZone} 
                      onChange={e => setShippingZone(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #bfdbfe', backgroundColor: '#ffffff', color: '#1e3a8a', marginBottom: '0.5rem' }}
                    >
                      <option value="cercania">Cercanía (Santa Cruz, La Laguna, Tegueste, El Rosario) - 5.00€</option>
                      <option value="lejos">Distancias largas (Sur, Norte, etc.) - 10.00€</option>
                    </select>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
                      *Envío gratis en compras superiores a 110€.
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#b45309', backgroundColor: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      <strong>⚠️ Importante:</strong> Se verificará la dirección de entrega introducida. Si la zona seleccionada no se corresponde con la dirección real (código postal), se ajustará el coste del envío al enviarte el enlace de pago.
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Notas del pedido (opcional)</label>
                <textarea value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '80px' }} placeholder="Instrucciones especiales para la entrega, etc." />
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="var(--primary)" /> Método de Pago
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', backgroundColor: paymentMethod === 'Tarjeta (Enlace de Pago)' ? '#fdf2f8' : 'transparent', borderColor: paymentMethod === 'Tarjeta (Enlace de Pago)' ? 'var(--primary)' : 'var(--border)' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'Tarjeta (Enlace de Pago)'} onChange={() => setPaymentMethod('Tarjeta (Enlace de Pago)')} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Tarjeta de Crédito / Débito (Enlace de pago)</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Al confirmar el pedido y stock, te enviaremos por WhatsApp un enlace de pago seguro.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', backgroundColor: paymentMethod === 'Bizum' ? '#fdf2f8' : 'transparent', borderColor: paymentMethod === 'Bizum' ? 'var(--primary)' : 'var(--border)' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'Bizum'} onChange={() => setPaymentMethod('Bizum')} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Bizum</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Te enviaremos las instrucciones y el número por WhatsApp al confirmar stock.</div>
                </div>
              </label>
            </div>
          </div>
          </>
          )}
        </div>
        
        {/* Resumen de Compra */}
        <div style={{ flex: '1 1 min(100%, 350px)', backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', position: 'sticky', top: '120px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--primary)" /> Resumen de Compra
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.cantidad}x {item.nombre}</span>
                <span style={{ fontWeight: 500 }}>{(item.cantidad * item.precio).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          {/* Fidelidad / Puntos */}
          {user && puntosDisponibles > 0 && (
            <div style={{ backgroundColor: '#fdf2f8', border: '1px dashed var(--primary)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Gift size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)' }}>Animalarium Club</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Tienes <strong>{puntosDisponibles} puntos</strong> disponibles.
              </p>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={usePoints} 
                  onChange={(e) => setUsePoints(e.target.checked)} 
                  disabled={puntosAAplicar === 0 && maxPuntosPermitidos === 0}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', marginTop: '2px' }} 
                />
                <div style={{ fontSize: '0.9rem', lineHeight: 1.3 }}>
                  Canjear <strong>{usePoints ? puntosAAplicar : Math.min(puntosDisponibles, maxPuntosPermitidos)} puntos</strong> por un descuento de <strong>{usePoints ? descuentoPuntos.toFixed(2) : (Math.min(puntosDisponibles, maxPuntosPermitidos) * 0.50).toFixed(2)}€</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    *Límite máximo del 50% del total ({maxPuntosPermitidos} ptos)
                  </div>
                </div>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            
            {esPrimeraCompra && descuentoPrimeraCompra > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 500 }}>
                <span>10% Dto. 1ª Compra</span>
                <span>-{descuentoPrimeraCompra.toFixed(2)} €</span>
              </div>
            )}
            
            {usePoints && descuentoPuntos > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 500 }}>
                <span>Descuento Puntos</span>
                <span>-{descuentoPuntos.toFixed(2)} €</span>
              </div>
            )}
            
            {deliveryMethod === 'Envío a domicilio' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: isFreeShipping ? '#10b981' : 'var(--text-muted)', fontWeight: isFreeShipping ? 500 : 400 }}>
                <span>Envío a domicilio</span>
                <span>{isFreeShipping ? '¡GRATIS!' : `${shippingCost.toFixed(2)} €`}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '1.5rem', fontWeight: 800 }}>
              <span>Total</span>
              <span>{finalTotal.toFixed(2)} €</span>
            </div>
            
            {user && (
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.25rem' }}>
                Ganarás +{puntosAGanar} puntos con esta compra
              </div>
            )}
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleCheckout}
            disabled={processing || items.length === 0 || !formData.nombre || !formData.telefono || (deliveryMethod === 'Envío a domicilio' && !formData.direccion)}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            {processing ? (
              <><Loader2 className="animate-spin" size={20} style={{ marginRight: '8px' }} /> Procesando...</>
            ) : (
              'Confirmar Pedido'
            )}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Al confirmar el pedido aceptas nuestras condiciones de venta y política de devoluciones.
          </div>
        </div>
      </div>
    </div>
  );
}
