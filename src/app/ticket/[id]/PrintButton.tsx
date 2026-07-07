'use client';
export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="mt-6 border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded print:hidden transition-colors"
    >
      Imprimir o Guardar PDF
    </button>
  );
}
