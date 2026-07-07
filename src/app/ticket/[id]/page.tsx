import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';

export default async function TicketPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ status?: string }> }) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) return notFound();

  // Obtenemos el pedido usando la clave admin (bypassing RLS)
  const { data: order } = await supabaseAdmin
    ?.from('encargos_clientes')
    .select('*')
    .eq('id', orderId)
    .single() || { data: null };

  if (!order) return notFound();

  let meta = null;
  const match = (order.notas || '').match(/\[---METADATA---\]([\s\S]*?)\[---\/METADATA---\]/);
  if (match && match[1]) {
    try { meta = JSON.parse(match[1]); } catch(e) {}
  }
  
  if (!meta) return notFound();

  // Detectamos si viene de Redsys con status=success
  const isNewPayment = resolvedSearchParams.status === 'success';

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-xl mx-auto">
        {isNewPayment && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative print:hidden" role="alert">
            <strong className="font-bold">¡Pago completado! </strong>
            <span className="block sm:inline">Tu pago ha sido procesado correctamente.</span>
          </div>
        )}

        <div className="bg-white rounded shadow-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none">
          <div className="text-center p-8 border-b-2 border-dashed border-gray-300">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tighter">ANIMALARIUM</h1>
            <p className="text-gray-500 mt-1">C/ Ejemplo 123, Local 4, Tenerife</p>
            <p className="text-gray-500 font-mono mt-2">Telf: 627 691 792</p>
          </div>

          <div className="p-8">
            <div className="flex justify-between text-sm mb-6 text-gray-600 font-mono">
              <div>
                <p>FECHA: {new Date(order.created_at).toLocaleDateString('es-ES')}</p>
                <p>HORA: {new Date(order.created_at).toLocaleTimeString('es-ES')}</p>
              </div>
              <div className="text-right">
                <p>TICKET: #{order.id.toString().padStart(6, '0')}</p>
                <p>MÉTODO: {meta.metodo_pago || 'Web'}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 font-mono text-sm">
              <div className="flex justify-between font-bold border-b pb-2">
                <span className="w-2/3">CONCEPTO</span>
                <span className="w-1/3 text-right">IMPORTE</span>
              </div>
              
              {meta.items && meta.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <div className="w-2/3 pr-2">
                    {item.cantidad}x {item.nombre}
                  </div>
                  <div className="w-1/3 text-right">
                    {(item.cantidad * item.precio).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-gray-300 pt-4 space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span>BASE IMPONIBLE</span>
                <span>{(meta.items.reduce((acc: number, item: any) => acc + (item.cantidad * item.precio), 0) / 1.07).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>IGIC (7%)</span>
                <span>{(meta.items.reduce((acc: number, item: any) => acc + (item.cantidad * item.precio), 0) - (meta.items.reduce((acc: number, item: any) => acc + (item.cantidad * item.precio), 0) / 1.07)).toFixed(2)} €</span>
              </div>
              
              {meta.puntos_usados > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>DESCUENTO FIDELIDAD</span>
                  <span>-{meta.puntos_usados.toFixed(2)} €</span>
                </div>
              )}
              {meta.coste_envio > 0 && (
                <div className="flex justify-between">
                  <span>GASTOS DE ENVÍO</span>
                  <span>{meta.coste_envio.toFixed(2)} €</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold pt-4">
                <span>TOTAL FINAL</span>
                <span>{Number(meta.total_final).toFixed(2)} €</span>
              </div>
            </div>

            <div className="mt-12 text-center text-sm text-gray-500 font-mono">
              <p>¡GRACIAS POR SU COMPRA!</p>
              <p className="mt-2 text-xs">Este documento sirve como garantía de compra.</p>
              <PrintButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
