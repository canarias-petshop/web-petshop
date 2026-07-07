'use client';

import { useState, useRef } from 'react';

export default function PagoForm({ orderId, total }: { orderId: number, total: string }) {
  const [loadingCard, setLoadingCard] = useState(false);
  const [showBizum, setShowBizum] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [redsysData, setRedsysData] = useState<any>(null);

  const handlePayCard = async () => {
    setLoadingCard(true);
    try {
      const res = await fetch('/api/checkout/redsys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al generar pago');

      // data es el objeto { url, body: { Ds_SignatureVersion, Ds_MerchantParameters, Ds_Signature } }
      // que genera redsys-easy
      setRedsysData(data);

      // Usar setTimeout para esperar a que React renderice el formulario oculto
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 100);

    } catch (err: any) {
      alert(err.message);
      setLoadingCard(false);
    }
  };

  const tiendaWameUrl = `https://wa.me/34627691792?text=${encodeURIComponent(`Hola, acabo de realizar el pago por Bizum del pedido #${orderId} por valor de ${total}€.`)}`;

  return (
    <div className="space-y-4">
      {/* Botón de Pago Tarjeta */}
      <button 
        onClick={handlePayCard} 
        disabled={loadingCard}
        className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center space-x-3 disabled:opacity-70"
      >
        <svg xmlns="http://www.w3.org/.svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span>{loadingCard ? 'Conectando con Redsys...' : 'Pagar de forma Segura (Tarjeta)'}</span>
      </button>

      {/* Formulario Oculto Redsys */}
      {redsysData && (
        <form ref={formRef} action={redsysData.url} method="POST" className="hidden">
          {Object.entries(redsysData.body).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value as string} />
          ))}
        </form>
      )}

      {/* Separador */}
      <div className="relative py-4 flex items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">O usar</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Botón de Bizum */}
      <button 
        onClick={() => setShowBizum(!showBizum)} 
        className="w-full bg-[#00C2CB] hover:bg-[#009bA2] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M11 2L2 6l.2 11c1.5 5 8 9 9.8 9.8L12 27l.2-1.2C14 25 20.5 21 22 16l.2-11L11 2zm0 2.2l8.8 3.5-.1 9.5c-1 3.8-6.1 7.2-7.8 8.1-.6-.2-1-.4-1.6-.7-5.5-2.6-7-7-7-8V7.7L11 4.2zM7.5 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
        </svg>
        <span>Pagar Manualmente con Bizum</span>
      </button>

      {/* Instrucciones Bizum expandibles */}
      {showBizum && (
        <div className="mt-4 p-5 bg-[#e5f8f9] rounded-xl border border-[#00C2CB] text-sm text-gray-700 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-bold text-[#00C2CB] text-base mb-2">Instrucciones para pago con Bizum</h3>
          <p className="mb-2">1. Abre la app de tu banco y selecciona <strong>Enviar dinero (Bizum)</strong>.</p>
          <p className="mb-2">2. Introduce nuestro número de tienda: <strong className="text-lg">627691792</strong></p>
          <p className="mb-2">3. El importe exacto es: <strong className="text-lg">{total} €</strong></p>
          <p className="mb-4">4. En el concepto, pon tu número de pedido: <strong>#{orderId}</strong></p>
          
          <a href={tiendaWameUrl} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            ¡Ya he enviado el Bizum! (Avisar por WhatsApp)
          </a>
        </div>
      )}
    </div>
  );
}
