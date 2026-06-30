# Tienda Online (E-Commerce) - Animalarium

Este es el repositorio del Frontend (Tienda Online) de Animalarium, desarrollado en **Next.js 16 (App Router)** y conectado directamente a **Supabase** (la misma base de datos que utiliza el TPV físico).

## 🚀 Despliegue a Producción

- **URL de Producción**: [https://animalariumtenerife.es](https://animalariumtenerife.es)
- **Framework**: Next.js 16 (App Router)
- **Base de Datos**: Supabase (PostgreSQL)
- **Despliegue**: Vercel (Auto-despliegue automático con cada `git push` a la rama `main`)
- **Estilos**: Vanilla CSS con variables de diseño (sin Tailwind)

## 📦 Características Principales (Actualizado 30 Jun 2026)

- **Catálogo Sincronizado**: La web lee directamente de Supabase. Filtra automáticamente los artículos y oculta los que no son aptos para la web (solo muestra *Alimentación seca, húmeda y Snacks*).
- **Descripciones Asistidas por IA (Gemini)**: Todos los productos cuentan con descripciones comerciales y emojis generados de forma automatizada mediante Gemini 2.5 Flash. Las descripciones y la referencia (Ref:) se muestran dinámicamente en las tarjetas de producto.
- **Filtros Cruzados Avanzados**: Filtrado en tiempo real en la tienda online por Familia, Marca, Edad, Tamaño y Necesidad Especial, organizando el stock disponible.
- **Área "Mi Cuenta" (CRM Integrado)**: Conexión total con el historial de clientes del TPV. 
  - El usuario puede ver sus **Puntos Acumulados**.
  - Lista de sus **Mascotas** registradas.
  - El acceso a estos perfiles está protegido mediante RLS, pero expuesto de forma segura para lecturas permitidas mediante el cliente `anonSupabase`.
- **Lógica de Envíos**: Cálculo dinámico de portes según la zona (Cercanía 5€, Lejos 10€, Gratis +130€), incluyendo impuestos como un "Servicio" en los tickets.
- **Auto-registro Seguro**: Los nuevos usuarios se cruzan por Nombre/Apellidos/Teléfono en la BD, evitando clientes duplicados y vinculando cuentas web a las fichas de tienda física.

## 🛠 Entorno de Desarrollo Local

Si deseas ejecutar la web de forma local en tu ordenador para hacer pruebas:

1. Asegúrate de tener Node.js instalado.
2. Crea un archivo `.env.local` en la raíz de este proyecto con tus credenciales de Supabase.
3. Ejecuta los siguientes comandos:

```bash
npm install
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en el navegador. Todos los cambios que guardes en el código se reflejarán instantáneamente.

## 📚 Enlaces de Interés

Para una visión completa de la arquitectura y la sincronización con el TPV físico, consulta el documento `RESUMEN_MAESTRO_ACTUALIZADO.md` ubicado en el proyecto del TPV.
