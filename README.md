# Resumen Maestro Actualizado - TPV y E-Commerce Animalarium
**Fecha de última actualización**: 6 de Julio de 2026

Este documento centraliza todos los avances, arquitecturas y módulos del ecosistema completo de Animalarium (TPV Físico + Tienda Web). Es el punto de partida **obligatorio** para retomar el proyecto en futuras sesiones.

> [!CAUTION]
> **NORMA ESTRICTA: PRODUCTOS vs SERVICIOS**
> Una cosa son los productos (piensos, accesorios) y otra muy distinta son los servicios (peluquería, clínica).
> Si el usuario ordena eliminar o modificar una marca concreta o un grupo de artículos en el contexto de "productos", **JAMÁS** debes alterar los registros que pertenezcan a "servicios" (aunque compartan tabla en la base de datos o utilicen la marca 'Genérico' u otra para categorizarse).
> **No asumas ni interpretes nada.** Verifica siempre si la acción puede afectar a los servicios antes de ejecutar un borrado masivo.

---

## 🆕 Últimos Cambios (5-6 de Julio de 2026)

### Limpieza y Deduplicación de Datos
- **Deduplicación de Proveedores**: Consolidados de 22 a 18 proveedores, eliminando duplicados por variaciones ortográficas.
- **Deduplicación de Productos**: Fusionados los genéricos CA-007/CA-008 con los productos OWNAT correctos OW-020/OW-021.
- **Catálogo Amanova (Tarifas 2025)**: Comprobación de 115 productos sin faltas. Eliminados 5 clones "12Ud" duplicados, prevaleciendo las cajas originales. Precios actualizados en tiempo real.
- **Propagación Borrador→Inventario (`facturacion.py`)**: Al confirmar un borrador, los cambios en Descripción, Ref/EAN, IGIC%, Base Ud y PVP se propagan al inventario.

### Generación Masiva y Corrección de Precios
- **142 multipacks** detectados → **134 unidades nuevas** creadas con sufijo `-UD` y `(Unidad)` en el nombre.
- **Regla de Redondeo Estricto**: Creado script para dividir el costo/PVP de las cajas en las unidades sueltas (ej. 24 sobres). El PVP resultante de las unidades se redondea al alza en tramos de 5 céntimos (`math.ceil(valor * 20) / 20`), dejando los PVPR de fabricantes intactos.
- **Actualización Exacta (Ownat y Amanova)**: Pouches corregidos matemáticamente (ej. 1.45€ Amanova, 1.85€ Ownat) respetando el precio de caja de los proveedores.

### Bugfix: Herramienta "Abrir Caja / Saco" (`inventario.py`)
- Corregido error de conversión float→int en `stock_actual`. Los UUIDs se dejan sin tocar.

### SEO, Supabase RLS y Arquitectura
- **Supabase RLS Bypass**: Corregido un fallo crítico que ocultaba el catálogo público. Se usa `supabaseAdmin` en `page.tsx` para leer los productos ignorando la política de seguridad RLS, devolviendo el catálogo web a la vida.
- **Sitemap XML** enviado y verificado en Google Search Console.
- **Redirecciones 301** en `next.config.ts` para URLs antiguas del Kit Digital.
- **Página de Contacto** (`/contacto`) creada con dirección, teléfono, WhatsApp y Google Maps.
- **Páginas Legales**: Aviso Legal, Privacidad, Términos.
- **SEO Metadata** completo en `layout.tsx`.

### Identidad Visual
- **Logo Transparente**: `LOGO.jpg` → `LOGO.png` (fondo transparente). Referencia actualizada en `layout.tsx`.
- **Favicon Personalizado**: Logo circular con huellitas como `icon.jpg` en `src/app/`.

---

## 🏆 Historial de Éxitos Completo

### 1. Sistema TPV (Tienda Local)
- Cobro Rápido, Gestión de Fichas CRM, Inventario Avanzado con columnas de caducidad/stock mínimo/marca.
- Herramienta de Desempaquetado (Abrir Caja/Saco) con bug de tipos corregido.
- CRM Encargos y Delivery, Reparto desde Caja, Centro de Recordatorios.
- Smart Caching de Streamlit y Sincronización en Caliente TPV↔CRM.

### 2. Tienda Online (E-Commerce)
- Diccionario Maestro Universal de categorización. Importación inteligente de Multipacks.
- Fusión de imágenes con Fuzzy Matching (800+ imágenes). Promociones automáticas 10% cajas.
- Checkout optimizado para WhatsApp/Bizum. Histórico de pedidos en Mi Cuenta.
- Filtros interactivos por marca/familia. Catálogo force-dynamic.
- Enriquecimiento IA (Gemini). Corrección RLS. Despliegue Vercel + dominio GoDaddy SSL.

### 3. Mantenimiento (Julio 2026)
- Corrección IA Gemini. Limpieza de vocabulario/filtros. Restauración estratégica de categorías.

### 4. Expansión Catálogo
- Lenda (132 productos), revisión Amanova y Atlantic Pet.
- Script anti-transparencias para imágenes. Normativa AGENTS.md para importaciones.

---

## 🚀 Próximos Pasos

- **Responsive Design** y Banners Rotativos.
- **Alertas de Antigüedad** en pedidos web y gestión de cancelaciones.
- **Agenda** con recurrencia de tareas.
- **UX Web**: filtros reactivos, pie de página, WhatsApp.
- **Integraciones**: Nuevas marcas, Stripe, accesorios, reservas peluquería.
