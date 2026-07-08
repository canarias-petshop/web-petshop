const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const supabase = createClient('https://zpzhsmyyyfxqbjjiuana.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwemhzbXl5eWZ4cWJqaml1YW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMzAxNiwiZXhwIjoyMDkxNjc5MDE2fQ.9gNW0JdUf_xnbfEuRnO3WoMPASXQjfqRBkyCjPE0DCY');

async function processOrder103() {
  const { data: order } = await supabase.from('encargos_clientes').select('*').eq('id', 103).single();
  const metaStr = order.notas.split('[---METADATA---]')[1].split('[---/METADATA---]')[0];
  const meta = JSON.parse(metaStr);
  const total = meta.total_final;

  // 1. Historial
  const { data: lastHashData } = await supabase.from('ventas_historial').select('hash_actual').order('id', { ascending: false }).limit(1);
  const hashAnt = (lastHashData && lastHashData.length > 0) ? lastHashData[0].hash_actual : 'GENESIS';
  const now = new Date();
  const dateISO = now.toISOString();
  const formatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'Atlantic/Canary', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fechaStr = formatter.format(now).replace(',', '');
  const strData = dateISO + '-' + total + '-' + hashAnt;
  const hashAct = crypto.createHash('sha256').update(strData).digest('hex');

  await supabase.from('ventas_historial').insert({
    fecha: fechaStr,
    productos: meta.items || [],
    total: total,
    pagado: total,
    pendiente: 0,
    metodo_pago: 'Tarjeta (WEB/REDSYS)',
    cliente_deuda: '',
    puntos_ganados: meta.puntos_ganados || 0,
    puntos_usados: meta.puntos_usados || 0,
    descuento_global: meta.descuento_primera_compra || 0,
    hash_anterior: hashAnt,
    hash_actual: hashAct,
    estado: 'Completado',
    cliente_vip_nombre: order.nombre_cliente || ''
  });

  // 2. Stock
  for (const item of (meta.items || [])) {
    if (item.id !== 'ENVIO') {
      const { data: prodData } = await supabase.from('productos').select('stock_actual').eq('id', item.id).single();
      if (prodData) {
        await supabase.from('productos').update({ stock_actual: (prodData.stock_actual || 0) - (item.cantidad || 1) }).eq('id', item.id);
      }
    }
  }

  // 3. Puntos
  if (meta.cliente_id) {
    const { data: cliData } = await supabase.from('clientes').select('puntos').eq('id', meta.cliente_id).single();
    if (cliData) {
      const nuevoSaldo = (cliData.puntos || 0) - (meta.puntos_usados || 0) + (meta.puntos_ganados || 0);
      await supabase.from('clientes').update({ puntos: nuevoSaldo }).eq('id', meta.cliente_id);
    }
  }

  // 4. Pedidos Domicilio
  await supabase.from('pedidos_domicilio').insert({
    nombre_cliente: order.nombre_cliente || '',
    telefono: order.telefono || '',
    direccion: meta.direccion || '',
    detalle_pedido: order.detalle_pedido || '',
    estado: 'Pendiente',
    notas: 'Pedido Web Redsys Pagado - Total: ' + total.toFixed(2) + '€'
  });

  console.log('Processed side effects for 103!');
}
processOrder103().catch(console.error);
