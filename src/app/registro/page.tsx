"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UserPlus, Mail, Lock, User, Phone, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    rgpd: false
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!formData.rgpd) {
      setError("Debes aceptar la política de privacidad");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Crear el usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono
          }
        }
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("No se pudo crear el usuario");

      const fullName = `${formData.nombre} ${formData.apellido}`.trim();

      // 2. Comprobar si el cliente ya existe por teléfono o por nombre completo
      const { data: existingClients, error: searchError } = await supabase
        .from('clientes')
        .select('*')
        .or(`telefono.eq.${formData.telefono},nombre_dueno.ilike.${fullName}`);
        
      if (searchError) throw searchError;

      if (existingClients && existingClients.length > 0) {
        // Actualizar el cliente existente con el auth_user_id
        const { error: updateError } = await supabase
          .from('clientes')
          .update({ auth_user_id: userId })
          .eq('id', existingClients[0].id);
          
        if (updateError && updateError.code !== 'PGRST204') { // Ignorar error si la columna no existe aún
            console.error("Error linking:", updateError);
        }
      } else {
        // Crear nuevo cliente
        const { error: insertError } = await supabase
          .from('clientes')
          .insert({
            nombre_dueno: `${formData.nombre} ${formData.apellido}`.trim(),
            telefono: formData.telefono,
            email: formData.email,
            puntos: 0,
            auth_user_id: userId
          });
          
        if (insertError && insertError.code !== 'PGRST204') {
            console.error("Error creating client:", insertError);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/mi-cuenta");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'var(--surface)', padding: '3rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', maxWidth: '500px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <UserPlus size={40} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>¡Registro completado!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Tu cuenta ha sido creada exitosamente. Te estamos redirigiendo a tu perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '550px', 
        backgroundColor: 'var(--surface)', 
        padding: '2.5rem', 
        borderRadius: 'var(--radius)', 
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            backgroundColor: 'var(--background)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '2px solid var(--primary)'
          }}>
            <UserPlus size={28} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Crea tu cuenta
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Únete a Animalarium y empieza a acumular puntos
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Nombre
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Apellidos
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Tus apellidos"
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Teléfono (Para asociar tus compras de la tienda)
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Phone size={18} />
              </div>
              <input 
                type="tel" 
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
                placeholder="600 000 000"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Correo electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Repite la Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </div>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              name="rgpd"
              id="rgpd"
              checked={formData.rgpd}
              onChange={handleChange}
              style={{ marginTop: '0.25rem', width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="rgpd" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              He leído y acepto la <Link href="/privacidad" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>política de privacidad</Link> y acepto el tratamiento de mis datos.
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', fontSize: '1.05rem', padding: '0.875rem' }}
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
}
