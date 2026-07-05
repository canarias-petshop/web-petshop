# Plan de Implementación: Gestión de Cajas y Traspasos (Desempaquetado)

Entendido perfectamente. La estrategia es mantener los productos "Caja/Saco" y "Unidad" como artículos totalmente independientes en el catálogo, pero **vinculados internamente**. De esta forma, compras cajas, el sistema registra cajas, y cuando abres físicamente una caja en la tienda, le dices al TPV que la traspase a unidades sueltas.

Este es el plan técnico para construir este sistema de traspasos ("Desempaquetado"):

## ⚠️ User Review Required

Para hacer esto, necesito modificar la base de datos de tu inventario. Por favor, revisa si este esquema te parece correcto antes de proceder:

> [!IMPORTANT]
> **Nuevas Columnas a crear en la base de datos (Tabla `productos`)**:
> 1. `tipo_formato`: Para saber si el artículo es 'Unidad', 'Caja', o 'Granel'.
> 2. `unidades_por_caja`: Un número para saber cuántas unidades trae (Ej: 12, 24, o 1000 en el caso de snacks).
> 3. `producto_vinculado_id`: Un enlace invisible que le dirá a la "Caja de Pollo" a qué "Unidad de Pollo" exacta tiene que sumarle el stock cuando decidas abrirla.

## 🛠️ Cambios Propuestos

### 1. Base de Datos (Supabase)
- Ejecutaré un script SQL para añadir estas tres columnas nuevas sin borrar ningún dato existente.

### 2. TPV - Gestión de Inventario (`inventario.py`)
- Añadiré las columnas `Tipo Formato` y `Unids/Caja` a la tabla editable para que puedas configurarlas fácilmente.
- Crearé una nueva herramienta / botón llamado **"📦 Abrir Caja (Traspaso a Unidades)"**.
  - **Cómo funcionará:** Seleccionas la caja en el inventario, pulsas el botón, indicas cuántas cajas vas a abrir físicamente en la tienda (por ejemplo, 1 caja) y el sistema automáticamente restará 1 al stock de la caja y sumará 12 al stock del producto "Unidad" vinculado.

### 3. TPV - Procesador de Facturas IA (`procesar_facturas_lote.py`)
- Ajustaremos la Inteligencia Artificial para que, al leer las facturas, cruce la información respetando si el proveedor facturó la Caja o la Unidad, asegurando que el stock de "Compras" se añada a la fila correcta.

### 4. Sobre la Tienda Web (El descuento)
- La lógica que hice antes en la web **ya está funcionando y es compatible con esto**. En la web seguirán existiendo los productos "(Caja 12 Ud)". 
- Como esos productos tienen la palabra "caja" en el nombre, el sistema de la web los detecta automáticamente, les pone la etiqueta roja de **-10% DTO. CAJA** y les baja el precio un 10% en el carrito.
- *(Nota: Si antes no lo veías en la web, probablemente fue porque Vercel aún estaba cargando o porque abriste un producto "Unidad" que lógicamente no lleva el descuento de caja. Al tenerlos separados, el descuento solo se aplicará al producto que sea la Caja).*
