import Link from 'next/link';

export default function Privacidad() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Política de Privacidad</h1>
      
      <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <p style={{ marginBottom: '2rem' }}>En Animalarium nos tomamos muy en serio la privacidad de nuestros clientes. A continuación te explicamos qué hacemos con los datos que nos proporcionas.</p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>1. Responsable del Tratamiento</h2>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Titular:</strong> Raquel Trujillo Hernández (78854854K)</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Dirección:</strong> Calle José Hernández Alfonso 26, Santa Cruz de Tenerife</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Correo electrónico:</strong> animalarium.tenerife@gmail.com</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>2. Finalidad de los datos</h2>
        <p style={{ marginBottom: '2rem' }}>Los datos personales que nos proporciones a través del proceso de compra o contacto serán utilizados única y exclusivamente para: <br/>
        - Gestionar y enviar tu pedido a domicilio.<br/>
        - Contactarte en caso de incidencias con tu pedido.<br/>
        - Emitir la factura de compra.</p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>3. Compartir datos con terceros</h2>
        <p style={{ marginBottom: '2rem' }}>Animalarium NO vende, alquila ni cede tus datos personales a terceros bajo ninguna circunstancia, salvo a empresas de mensajería estrictamente necesarias para realizar el envío de tus productos.</p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>4. Derechos del usuario</h2>
        <p style={{ marginBottom: '2rem' }}>Como usuario tienes derecho a acceder, rectificar o solicitar la eliminación de tus datos personales de nuestra base de datos. Para ejercer estos derechos, solo tienes que enviarnos un email a <strong>animalarium.tenerife@gmail.com</strong> adjuntando una copia de tu DNI.</p>
        
        <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
