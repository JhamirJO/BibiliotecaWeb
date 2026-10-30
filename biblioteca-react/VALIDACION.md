# Validación de la entrega

Fecha: 30 de octubre de 2026.

- Instalación con `pnpm install --frozen-lockfile`: correcta.
- `pnpm lint` y `pnpm build`: correctos, sin advertencias de compilación.
- Auditoría de dependencias: cero vulnerabilidades conocidas en la resolución entregada.
- 14 pantallas revisadas a 1440, 390 y 320 px, sin errores de JavaScript ni desbordamiento horizontal de la página. Las tablas extensas usan desplazamiento dentro de su panel.
- Comprobante generado en una página A5.
- 28 archivos de API, Redux, almacenamiento de sesión y configuración de navegación comparados: sin cambios respecto del archivo recibido.

## Flujos ejercitados con API simulada

- Publicaciones: búsqueda, estado vacío, cero copias, filtro y detalle con Escape.
- Edición: carga los valores de la publicación existente.
- Creación de libro: conserva multipart y el endpoint original.
- Usuarios: detalle accesible y creación de lector con sus campos originales.
- Préstamo: máximo tres, quitar códigos, payload y comprobante con impresión.
- Devoluciones: ambos modos conservan endpoints y payloads.
- Sanciones: búsqueda y levantamiento original.
- Notificaciones: apertura, lectura y actualización Redux.
- Lector: filtros, ficha, navegación por rol y cambio de contraseña.
- Bibliotecario: permisos y menú móvil.
- Login: visibilidad de contraseña, JWT y redirección por rol.

Las pruebas utilizaron respuestas simuladas y verificaron las solicitudes salientes. No se ejecutaron operaciones contra el backend real. Corresponde completar una prueba de integración con el backend disponible y las cuentas del proyecto antes de publicar.
