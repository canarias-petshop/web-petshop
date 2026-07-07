import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PagoForm from './PagoForm';

export default async function PagoPage({ params }: { params: { id: string } }) {
  const orderId = parseInt(params.id, 10);
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#D31F3D] py-6 px-8 text-white">
          <h1 className="text-2xl font-bold">Finalizar Pago</h1>
          <p className="text-red-100 mt-1">Revisa los detalles finales de tu pedido</p>
        </div>
        <div className="p-8 text-gray-800">
          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Resumen del Pedido #{order.id}</h2>
            <div className="space-y-4">
              {meta.items && meta.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{item.cantidad}x</span> {item.nombre}
                  </div>
                  <div className="font-semibold whitespace-nowrap ml-4">
                    {(item.cantidad * item.precio).toFixed(2)} €
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{meta.items.reduce((acc: number, item: any) => acc + (item.cantidad * item.precio), 0).toFixed(2)} €</span>
                </div>
                {meta.puntos_usados > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento de puntos:</span>
                    <span>-{meta.puntos_usados.toFixed(2)} €</span>
                  </div>
                )}
                {meta.coste_envio > 0 && (
                  <div className="flex justify-between">
                    <span>Gastos de envío:</span>
                    <span>{meta.coste_envio.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t mt-2">
                  <span>Total a Pagar:</span>
                  <span className="text-[#D31F3D]">{Number(meta.total_final).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
          <PagoForm orderId={order.id} total={Number(meta.total_final).toFixed(2)} />
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
