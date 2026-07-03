import Link from 'next/link';

export default function Terminos() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Términos y Condiciones</h1>
      
      <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <p style={{ marginBottom: '2rem' }}>A continuación detallamos las condiciones de compra, envío y devoluciones de la tienda online de Animalarium.</p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>1. Política de Envíos</h2>
        <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Recogida en Tienda (Santa Cruz de Tenerife):</strong> GRATIS. Podrás pasar a buscar tu pedido el mismo día o al día siguiente laborable.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Envío Local (Santa Cruz y cercanías):</strong> 5 €.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Envío Resto de Tenerife (Sur/Norte):</strong> 10 €.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Envío GRATIS:</strong> En todos los pedidos que superen los <strong>110 €</strong>.</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>2. Plazos de Entrega</h2>
        <p style={{ marginBottom: '1rem' }}>Al ser repartos gestionados directamente por nuestra tienda, intentamos que las entregas locales se realicen en 24/48 horas laborables siempre que haya stock disponible del producto seleccionado.</p>
        <p style={{ marginBottom: '2rem' }}><strong>Importante:</strong> Los pedidos realizados a partir del <strong>jueves a las 20:00h</strong>, así como los realizados en fin de semana, empezarán a gestionarse a partir del lunes siguiente, por lo que su entrega (en caso de no disponer de stock físico inmediato) se efectuará entre el lunes y el martes de la semana entrante.</p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>3. Devoluciones</h2>
        <p style={{ marginBottom: '2rem' }}>Si te has equivocado de pienso o el producto llega en mal estado, dispones de 14 días naturales para solicitar una devolución o cambio. El producto debe estar cerrado, sin usar y en su embalaje original. Los gastos de envío por la devolución correrán a cargo del cliente salvo que el producto estuviera defectuoso.</p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>4. Métodos de Pago</h2>
        <p style={{ marginBottom: '2rem' }}>Actualmente aceptamos pagos mediante Tarjeta de Crédito/Débito. Toda transacción está protegida y encriptada por la pasarela de pago bancaria.</p>

        <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
