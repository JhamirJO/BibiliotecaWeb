# Biblioteca San Marcos

Aplicación web para la gestión de una biblioteca, con un portal de consulta para lectores y un espacio de trabajo para bibliotecarios y administradores. Integra el catálogo de libros, artículos y tesis con la gestión de usuarios, préstamos, devoluciones, sanciones y notificaciones.

El proyecto contiene una API desarrollada con **Java 21 y Spring WebFlux** y un frontend en **React**, con acceso según el rol del usuario.

[Vista previa](#vista-previa) · [Funcionalidades](#funcionalidades) · [Tecnologías](#tecnologías) · [Puesta en marcha](#puesta-en-marcha)

## Vista previa

### Catálogo del lector

Consulta de publicaciones con portada, autor, filtros y disponibilidad de ejemplares.

![Catálogo del lector con portadas de libros, búsqueda y filtro por tipo](docs/screenshots/catalogo.png)

<details>
<summary><strong>Ver acceso, gestión de publicaciones, formulario y reportes</strong></summary>

### Acceso al portal

Inicio de sesión con las credenciales proporcionadas por la biblioteca.

![Pantalla de inicio de sesión de Biblioteca San Marcos](docs/screenshots/login.png)

### Gestión de publicaciones

Listado con búsqueda, filtro por tipo y acciones para consultar, editar o cambiar el estado de una publicación.

![Tabla de publicaciones con portadas, autores, copias, estado y acciones](docs/screenshots/publicaciones.png)

### Registro de publicaciones

Formulario organizado en datos generales, información específica y ejemplares, con campos según el tipo seleccionado.

![Formulario de nuevo libro con secciones y panel de información](docs/screenshots/nueva-publicacion.png)

### Reportes

Visualización de préstamos, estados, distribución del catálogo y uso de publicaciones.

![Panel de reportes con gráficos de préstamos y composición del catálogo](docs/screenshots/reportes.png)

</details>

Las capturas corresponden a la interfaz del proyecto. Los registros y las cifras mostrados dependen de la base de datos utilizada.

## Funcionalidades

| Módulo | Alcance |
| --- | --- |
| Catálogo | Consulta de libros, artículos y tesis, búsqueda por título o autor, filtros y fichas de detalle. |
| Publicaciones | Registro y edición de datos, portadas, ejemplares y estado de disponibilidad. |
| Usuarios | Gestión de lectores y bibliotecarios, información personal y datos de acceso. |
| Préstamos | Registro de publicaciones prestadas, fechas y emisión de comprobantes imprimibles. |
| Devoluciones | Registro por código de préstamo o por número de comprobante. |
| Sanciones | Consulta del estado de un lector y levantamiento de sanciones. |
| Notificaciones | Consulta y marcado de avisos relacionados con préstamos. |
| Reportes | Gráficos sobre préstamos, lectores y publicaciones. |
| Mi cuenta | Consulta del perfil, cambio de contraseña e historial de préstamos del lector. |

### Acceso por rol en la interfaz

| Rol | Acceso principal |
| --- | --- |
| Administrador | Módulos de gestión, reportes y creación de cuentas de bibliotecario. |
| Bibliotecario | Gestión de publicaciones y lectores, préstamos, devoluciones y sanciones. |
| Lector | Catálogo, fichas de publicaciones, historial de préstamos y perfil. |

La autenticación utiliza JWT. La navegación y las opciones visibles se ajustan al rol de la cuenta.

## Tecnologías

| Componente | Tecnologías |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5.6, Spring WebFlux, Spring Security, JWT, Spring Data R2DBC y Maven Wrapper. |
| Base de datos | PostgreSQL, con conexión reactiva mediante R2DBC. |
| Frontend | React 19, Vite, Redux Toolkit y React Router. |
| Interfaz | Tailwind CSS, estilos propios, Lucide React, Nivo y SweetAlert2. |
| Dependencias del frontend | pnpm, con versiones fijadas y archivo `pnpm-lock.yaml`. |

## Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| `Biblioteca - back/` | API, autenticación, reglas de negocio y acceso a PostgreSQL. |
| `Biblioteca - front/` | Aplicación React, rutas, estado global y estilos de la interfaz. |
| `docs/screenshots/` | Capturas utilizadas en este README. |

El backend organiza el código en `domain`, `application`, `infrastructure` y `presentation`. El frontend separa los módulos de pantalla, componentes reutilizables, acciones, slices y estilos.

## Requisitos

- **Java 21** para el backend.
- **PostgreSQL** con la estructura y las funciones de base de datos utilizadas por la aplicación.
- **Node.js 22.13 o superior**.
- **pnpm 11.25.0**, indicado en `package.json`.

El backend incluye Maven Wrapper; no es necesario instalar Maven por separado.

Si todavía no tienes la versión de pnpm del proyecto:

```bash
npm install -g pnpm@11.25.0
```

## Puesta en marcha

Ejecuta los comandos desde la raíz del repositorio, salvo cuando se indique otra carpeta. Mantén el backend y el frontend abiertos en terminales separadas.

### 1. Preparar PostgreSQL

Configura una base de datos accesible desde el backend. Este repositorio no incluye scripts SQL de creación o migración: requiere disponer del esquema, las tablas y las funciones PostgreSQL que utiliza el sistema.

### 2. Configurar e iniciar el backend

Entra en la carpeta del backend y copia el archivo de ejemplo:

```bash
cd "Biblioteca - back"
cp .env.example .env
```

En PowerShell puedes realizar la copia con `Copy-Item .env.example .env`.

Completa estas variables en `.env`:

| Variable | Descripción |
| --- | --- |
| `DATABASE_HOST` | Servidor de PostgreSQL; por ejemplo, `localhost`. |
| `DATABASE_PORT` | Puerto de PostgreSQL; habitualmente `5432`. |
| `DATABASE_NAME` | Nombre de la base de datos preparada para la aplicación. |
| `DATABASE_USER` | Usuario con acceso a la base de datos. |
| `DATABASE_PASSWORD` | Contraseña del usuario de base de datos. |
| `JWT_SECRET_BASE64` | Clave secreta en Base64 válida para la firma JWT HS256. |

Los valores de `.env.example` son marcadores de configuración; reemplázalos por los de tu entorno. El backend carga `.env` desde su directorio de ejecución.

**Windows / PowerShell:**

```powershell
.\mvnw.cmd spring-boot:run
```

**Linux o macOS:**

```bash
./mvnw spring-boot:run
```

Con la configuración actual, la API se inicia en `http://localhost:8080`.

### 3. Configurar e iniciar el frontend

Desde una segunda terminal, situada en la raíz del repositorio:

```bash
cd "Biblioteca - front"
cp .env.example .env
pnpm install --frozen-lockfile
pnpm run dev
```

En PowerShell puedes realizar la copia con `Copy-Item .env.example .env`.

El archivo `.env` define la URL del backend y los segmentos de las API. Para la configuración local incluida:

```dotenv
VITE_APP_BACKEND_URL=http://localhost:8080/
VITE_APP_API_Lector=api-lector
VITE_APP_API_Publicacion=api-pub
VITE_APP_API_Prestamo=api-pres
VITE_APP_API_Bibliotecario=api-biblio
VITE_APP_API_Devolucion=api-dev
VITE_APP_API_Sancion=api-sancion
VITE_APP_API_Notificacion=api-noti
VITE_APP_API_Auth=api-auth
VITE_APP_API_User=api-user
VITE_DEBUG=true
```

Conserva la barra final de `VITE_APP_BACKEND_URL`, porque las solicitudes concatenan esa URL con el segmento de cada API.

Abre `http://localhost:5173`. El backend tiene configurado CORS para ese origen; si Vite inicia en otro puerto o cambias el dominio, ajusta `CorsConfig.java` para que coincida con el origen del frontend.

### 4. Ingresar al sistema

Usa una cuenta existente de administrador, bibliotecario o lector. El proyecto no incluye credenciales de demostración ni un registro público desde la interfaz; las cuentas deben existir en la base de datos o crearse mediante los flujos de administración correspondientes.

## Comandos de desarrollo

Ejecuta los comandos de frontend dentro de `Biblioteca - front/`:

| Comando | Propósito |
| --- | --- |
| `pnpm run dev` | Iniciar el servidor de desarrollo. |
| `pnpm lint` | Revisar el código con ESLint. |
| `pnpm build` | Generar la compilación de producción en `dist/`. |
| `pnpm preview` | Revisar localmente la compilación de producción. |
| `pnpm check` | Ejecutar ESLint y generar la compilación. |

Para las pruebas del backend, ejecuta `./mvnw test` o `.\mvnw.cmd test` dentro de `Biblioteca - back/`, con el entorno de base de datos configurado.

## Configuración local

- Conserva los archivos `.env` fuera del control de versiones; los ejemplos están en cada proyecto.
- Utiliza pnpm y conserva `pnpm-lock.yaml` para mantener la resolución de dependencias del frontend.
- Las capturas del README se enlazan mediante rutas relativas, por lo que `docs/screenshots/` debe acompañar al archivo al subirlo al repositorio.
