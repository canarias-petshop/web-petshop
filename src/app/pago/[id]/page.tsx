import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PagoForm from './PagoForm';

export default async function PagoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) return notFound();

  // Obtenemos el pedido usando la clave admin (bypassing RLS)
  if (!supabaseAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-800 p-6 rounded-lg max-w-lg text-center">
          <h1 className="text-xl font-bold mb-2">Error de Servidor</h1>
          <p>Falta la variable SUPABASE_SERVICE_ROLE_KEY en Vercel. Contacta con soporte.</p>
        </div>
      </div>
    );
  }

  const { data: order, error } = await supabaseAdmin
    .from('encargos_clientes')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-800 p-6 rounded-lg max-w-lg text-center">
          <h1 className="text-xl font-bold mb-2">Pedido no encontrado</h1>
          <p>{error?.message || "No se encontró el ID en la base de datos."}</p>
        </div>
      </div>
    );
  }

  let meta = null;
  const match = (order.notas || '').match(/\[---METADATA---\]([\s\S]*?)\[---\/METADATA---\]/);
  if (match && match[1]) {
    try { meta = JSON.parse(match[1]); } catch(e) {}
  }
  
  if (!meta || typeof meta.total_final === 'undefined') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow text-gray-800 border-t-4 border-red-500">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error en el Pedido</h1>
          <p>Este pedido no tiene un carrito válido asignado. Por favor, contacta con la tienda.</p>
        </div>
      </div>
    );
  }

  // Si ya está pagado/confirmado, no dejar pagar de nuevo
  if (
    order.estado.includes('Confirmado') || 
    order.estado.includes('Entregado') || 
    order.estado.includes('Completado')
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow text-gray-800 border-t-4 border-green-500">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Pedido Ya Pagado</h1>
          <p className="mb-6 text-gray-600">Este pedido ya se encuentra confirmado y en proceso. ¡Gracias por tu compra!</p>
          <a href={`/ticket/${order.id}`} className="inline-block bg-[#D31F3D] text-white py-3 px-8 rounded-lg font-bold hover:bg-red-800 transition-colors">
            Ver Ticket
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-[#D31F3D] to-[#b3142f] py-8 px-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
          <h1 className="text-3xl font-extrabold tracking-tight relative z-10">Animalarium</h1>
          <p className="text-red-100 mt-2 text-sm font-medium tracking-wide uppercase relative z-10">Finalizar Pago</p>
        </div>
        
        <div className="p-8 sm:p-10 text-gray-800">
          <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-3 flex justify-between items-center">
              <span>Pedido #{order.id}</span>
              <span className="bg-[#D31F3D] bg-opacity-10 text-[#D31F3D] py-1 px-3 rounded-full text-xs">Pendiente</span>
            </h2>
            
            <div className="space-y-4">
              {meta.items && meta.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-start text-sm">
                  <div className="flex-1 pr-4">
                    <span className="font-bold text-[#D31F3D] mr-2">{item.cantidad}x</span> 
                    <span className="font-medium text-gray-700">{item.nombre}</span>
                  </div>
                  <div className="font-semibold text-gray-900 whitespace-nowrap mt-0.5">
                    {(item.cantidad * item.precio).toFixed(2)} €
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-2 text-sm text-gray-500">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-700">{meta.items.reduce((acc: number, item: any) => acc + (item.cantidad * item.precio), 0).toFixed(2)} €</span>
                </div>
                {meta.puntos_usados > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>Descuento fidelidad</span>
                    <span className="font-medium">-{meta.puntos_usados.toFixed(2)} €</span>
                  </div>
                )}
                {meta.coste_envio > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Gastos de envío</span>
                    <span className="font-medium text-gray-700">{meta.coste_envio.toFixed(2)} €</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-dashed border-gray-200">
                <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total a Pagar</span>
                <span className="text-3xl font-extrabold text-gray-900">{Number(meta.total_final).toFixed(2)} €</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <PagoForm orderId={order.id} total={Number(meta.total_final).toFixed(2)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
