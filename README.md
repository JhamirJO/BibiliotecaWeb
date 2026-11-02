# Biblioteca

Aplicación web para la gestión de una biblioteca. Permite administrar usuarios, publicaciones, préstamos, devoluciones, sanciones y notificaciones.

## Estructura del proyecto

```text
Biblioteca/
├── Biblioteca - back/    # API y lógica del sistema
├── Biblioteca - front/   # Interfaz web
└── README.md
```

## Tecnologías

### Backend

* Java 21
* Spring Boot
* Spring WebFlux
* Spring Security y JWT
* Spring Data R2DBC
* PostgreSQL
* Maven

### Frontend

* React
* Vite
* Redux Toolkit
* React Router
* Tailwind CSS

## Requisitos

* Java 21
* PostgreSQL
* Node.js y npm

## Configuración

Cada proyecto contiene un archivo `.env.example`. Antes de ejecutar la aplicación, crea el archivo `.env` correspondiente.

### Backend

```bash
cd "Biblioteca - back"
cp .env.example .env
```

Configura en `.env` la conexión a PostgreSQL y la clave utilizada para JWT.

### Frontend

```bash
cd "Biblioteca - front"
cp .env.example .env
```

El frontend está configurado para conectarse por defecto al backend en `http://localhost:8080`.

## Ejecución

### Iniciar el backend

En Windows:

```bash
cd "Biblioteca - back"
.\mvnw.cmd spring-boot:run
```

En Linux o macOS:

```bash
cd "Biblioteca - back"
./mvnw spring-boot:run
```

### Iniciar el frontend

```bash
cd "Biblioteca - front"
npm install
npm run dev
```