# Biblioteca · React

Adaptación del frontend entregado en `Biblioteca - front(1).rar` al diseño de la segunda propuesta, con el catálogo de portadas de la primera. Mantiene React, Redux, rutas, roles y la integración existente con el backend.

## Iniciar el proyecto

Requisitos: Node.js **22.13 o superior** y **pnpm 11.25.0**. Si todavía no tienes pnpm, puedes instalar esa versión con `npm install -g pnpm@11.25.0`.

1. Conserva tu archivo `.env` actual o copia `.env.example` a `.env` y configura la URL y los nombres de las API.
2. Ejecuta desde esta carpeta:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

El backend debe estar disponible para iniciar sesión y consultar o registrar datos. Esta entrega usa las API reales del proyecto; las respuestas simuladas se utilizaron únicamente durante la validación y no se incluyen en la aplicación.

```bash
pnpm lint       # Revisión del código
pnpm build      # Generar dist/
pnpm preview    # Revisar la compilación localmente
pnpm check      # Lint y compilación
```

## Cambios

- Navegación horizontal, paleta azul marino y verde petróleo, tipografía local, formularios y tablas consistentes, adaptación a móvil y estados de carga, error y vacío.
- Catálogo del lector con portadas verticales, búsqueda, filtros, paginación y la ficha existente.
- Iconos importados de `lucide-react`. `src/utils/Icons.jsx` conserva los nombres usados por los componentes originales. Lucide genera SVG internamente; ya no es necesario mantener sus trazados a mano.
- Mejoras de etiquetas, foco visible, navegación con teclado y cierre de diálogos con Escape.
- Comprobante con el formato A5 y la impresión del proyecto original.
- Carga diferida de las pantallas y correcciones de imports con mayúsculas que impedían compilar en Linux.
- Configuración de Vite corregida: Tailwind se procesa desde PostCSS.

## Dependencias y pnpm

`package.json` fija las versiones y el gestor; `pnpm-lock.yaml` conserva la resolución. Se retiró `package-lock.json` para mantener un único archivo de bloqueo.

La configuración exige una antigüedad mínima de 1440 minutos al resolver nuevas dependencias y permite explícitamente el script de instalación de `esbuild`. Los demás scripts de dependencias requieren una decisión expresa. No elimines estos controles para resolver una instalación sin revisar antes el paquete afectado.

Se retiraron `daisyui`, `html2canvas` y `jspdf`, que no tenían imports en el código recibido. Los estilos de componentes se definen en el proyecto y el comprobante conserva la impresión nativa del navegador.

Cambiar de gestor no garantiza por sí solo la seguridad. Mantén Node, pnpm y las dependencias revisados. La auditoría realizada el 30 de octubre de 2026 informó **cero vulnerabilidades conocidas**; ese resultado corresponde a esa fecha y resolución.

## Estructura visual

- `src/styles/theme.css`: sistema visual y componentes de la aplicación.
- `src/styles/public.css`: portada y acceso.
- `src/components/layout/`: marca y encabezados compartidos.
- `src/general/dashboard/`: estructura del portal y navegación por rol.
- `src/general/pages/publicaciones/PublicacionCatalogo.jsx` y `catalogoCard/`: catálogo del lector.
- `src/assets/fonts/` y `src/assets/media/`: recursos locales.

Los datos informativos de la portada (contacto, cifras y plazo) proceden del frontend recibido; revísalos si han cambiado.

## Validación y alcance

Se comprobó la compilación de producción y ESLint. Las vistas se revisaron en escritorio y anchos de 390 y 320 px. Se ejercitaron los principales formularios con respuestas API simuladas, verificando los endpoints y cuerpos de las solicitudes, sin operar sobre una base real.

Antes de desplegar, realiza una prueba con tu backend y tus cuentas reales. El ZIP excluye `.env`, `node_modules` y `dist`; conserva tu `.env` al sustituir el frontend. No se incorporan nuevas funciones de negocio.
