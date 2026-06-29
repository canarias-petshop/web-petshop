import Link from 'next/link';

export default function AvisoLegal() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Aviso Legal</h1>
      
      <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>1. Datos Identificativos</h2>
        <p style={{ marginBottom: '1rem' }}>En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se reflejan a continuación los siguientes datos:</p>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Titular:</strong> Raquel Trujillo Hernández</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>NIF/DNI:</strong> 78854854K</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Nombre Comercial:</strong> Animalarium</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Dirección:</strong> Calle José Hernández Alfonso 26, Santa Cruz de Tenerife</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Teléfono:</strong> 922 065 170 / 672 481 295</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Correo electrónico:</strong> animalarium.tenerife@gmail.com</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>2. Usuarios</h2>
        <p style={{ marginBottom: '2rem' }}>El acceso y/o uso de este portal web atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.</p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>3. Uso del Portal</h2>
        <p style={{ marginBottom: '2rem' }}>El usuario asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos. El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que Animalarium ofrece a través de su portal.</p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>4. Propiedad Intelectual e Industrial</h2>
        <p style={{ marginBottom: '2rem' }}>Animalarium por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma. Todos los derechos reservados.</p>
        
        <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
