# Gestión de Esports

Plataforma para la gestión profesional de equipos de esports, torneos y jugadores.

## Introducción para Nuevos Desarrolladores

Este proyecto es una plataforma completa para la gestión de equipos y competiciones de esports. Está diseñado siguiendo principios de arquitectura limpia (hexagonal) para garantizar un código mantenible, testeable y escalable.

### Visión General de la Arquitectura

El proyecto sigue una **arquitectura hexagonal** (también conocida como "puertos y adaptadores"), que separa claramente:

- **Dominio**: El núcleo de la aplicación con las reglas de negocio y entidades
- **Aplicación**: Casos de uso que orquestan las operaciones de dominio
- **Infraestructura**: Implementaciones concretas para bases de datos, frameworks, etc.

Esta separación nos permite:
- Cambiar tecnologías subyacentes sin afectar la lógica de negocio
- Probar componentes de forma aislada
- Desarrollar en paralelo diferentes capas del sistema

### Infraestructura y Despliegue

Utilizamos un enfoque basado en contenedores con Docker para garantizar entornos consistentes:

- **Frontend**: Contenedor Node.js con la aplicación React
- **Backend**: Contenedor Node.js con la API Express
- **Base de Datos**: Contenedor MySQL para persistencia
- **Nginx**: Como proxy inverso y para servir el frontend compilado

Todo el stack se puede levantar con un solo comando mediante Docker Compose, tanto en entorno de desarrollo como en producción.

### Flujo de Trabajo para Desarrolladores

Como nuevo desarrollador, estos son los pasos principales para comenzar:

1. **Configuración inicial**: Clona el repositorio y ejecuta `npm install` y `npm run bootstrap`
2. **Entorno de desarrollo**: Inicia el entorno con `npm run docker-start` o `make dev`
3. **Desarrollo**:
   - Frontend (sin Docker): `cd packages/frontend && npm start`
   - Backend (sin Docker): `cd packages/backend && npm start`
4. **Commits**: Utiliza `npm run commit` o `make commit` para seguir las convenciones del proyecto
5. **CI/CD**: Cada push a main pasa por pruebas automatizadas antes del despliegue

### Tecnologías y Patrones

La plataforma está construida con un stack tecnológico moderno:

- **Patrón CQRS**: Separación de operaciones de lectura y escritura
- **Arquitectura de Estado**: Redux con slice pattern
- **API RESTful**: Diseñada siguiendo principios de madurez Richardson
- **Principios SOLID**: Guían el diseño de todos los componentes
- **DDD (Domain-Driven Design)**: Enfoque en el modelado del dominio

## Buenas Prácticas de Código

En este proyecto seguimos estrictas convenciones de código para asegurar la legibilidad, mantenibilidad y calidad. A continuación se detallan las principales prácticas con ejemplos:

### Estilo de Código (Prettier)

Utilizamos Prettier con la siguiente configuración:
- Punto y coma al final de las sentencias
- 2 espacios de indentación
- Longitud máxima de línea: 100 caracteres
- Comillas simples
- Coma final en arrays y objetos multillínea

**Ejemplo correcto:**
```typescript
const getUserData = async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return {
      id: response.data.id,
      name: response.data.name,
      role: response.data.role,
    };
  } catch (error) {
    logger.error('Error fetching user data', { userId, error });
    return null;
  }
};
```

### Reglas de ESLint

Algunas reglas clave:
- Organización de imports por grupos y orden alfabético
- Tipado estricto: no usar `any` explícito
- Manejo de variables no utilizadas
- Reglas específicas para React

**Ejemplo de organización de imports:**
```typescript
// Primero imports externos (en orden alfabético)
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Luego imports internos (con línea en blanco separando grupos)
import { fetchUserData } from '../api/userApi';
import { Button } from '../components/common';
import { AppDispatch } from '../store';
```

### Principios de Código Limpio

#### DRY (Don't Repeat Yourself)

```typescript
// ❌ Mal: código repetido
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateSignupForm(data: SignupFormData): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return false;
  // Más validaciones...
  return true;
}

// ✅ Bien: reutilización
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateSignupForm(data: SignupFormData): boolean {
  if (!validateEmail(data.email)) return false;
  // Más validaciones...
  return true;
}
```

#### YAGNI (You Aren't Gonna Need It)

Evitar implementar funcionalidades "por si acaso". Cada feature debe estar justificada por requerimientos actuales.

#### SOLID

**Principio de Responsabilidad Única (SRP):**
```typescript
// ❌ Mal: clase con múltiples responsabilidades
class UserManager {
  getUserProfile(id: string): UserProfile { /* ... */ }
  renderUserCard(user: UserProfile): JSX.Element { /* ... */ }
  updateUserData(id: string, data: UserUpdateData): Promise<void> { /* ... */ }
}

// ✅ Bien: separación de responsabilidades
class UserService {
  getUserProfile(id: string): UserProfile { /* ... */ }
  updateUserData(id: string, data: UserUpdateData): Promise<void> { /* ... */ }
}

function UserCard({ user }: { user: UserProfile }): JSX.Element {
  // Renderizado del componente
}
```

## Testing y Calidad de Código

En este proyecto seguimos un enfoque riguroso para la calidad del código mediante pruebas automatizadas:

### Requisitos de Cobertura

Mantenemos un **mínimo de 90% de cobertura** en:
- Statements (sentencias)
- Branches (ramas condicionales)
- Functions (funciones)
- Lines (líneas)

Estos umbrales se verifican automáticamente en cada pre-commit y en el pipeline de CI.

### Estrategia de Testing

#### Frontend
- **Tests Unitarios**: Para componentes aislados, hooks personalizados y utilidades
- **Tests de Integración**: Para flujos que involucran múltiples componentes
- **Tests E2E**: Con Cypress para validar flujos completos de usuario

#### Backend
- **Tests Unitarios**: Para funciones y servicios aislados
- **Tests de Integración**: Para APIs y endpoints
- **Tests de Repositorio**: Para validar interacciones con la base de datos

### Mejores Prácticas

- Seguir el patrón AAA (Arrange-Act-Assert)
- Utilizar mocks para dependencias externas
- Tests descriptivos que sirvan como documentación
- Enfocarse en comportamientos, no en implementaciones

**Ejemplo de test unitario:**
```typescript
describe('PasswordStrength', () => {
  it('debe mostrar fuerza débil cuando la contraseña tiene menos de 8 caracteres', () => {
    // Arrange
    render(<PasswordStrength password="abc123" />);
    
    // Act
    const strengthIndicator = screen.getByTestId('strength-indicator');
    
    // Assert
    expect(strengthIndicator).toHaveTextContent('Débil');
    expect(strengthIndicator).toHaveClass('weak');
  });
});
```

## Configuración Docker

Este proyecto está completamente dockerizado para garantizar entornos de desarrollo y producción consistentes. A continuación se detalla la estructura y funcionamiento de los contenedores.

### Estructura de Archivos Docker

El proyecto utiliza una organización clara de los archivos Docker:

```
gestion-esports/
├── docker/                          # Configuración centralizada de Docker
│   ├── docker-compose.yml           # Configuración base para todos los entornos
│   ├── docker-compose.override.yml  # Configuración específica para desarrollo
│   ├── docker-compose.prod.yml      # Configuración específica para producción
│   ├── nginx/                       # Configuración de Nginx (proxy)
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   └── default.conf
│   ├── db/                          # Configuración de base de datos
│   │   └── init/                    # Scripts SQL de inicialización
│   │       └── db_schema.sql        # Esquema completo de la base de datos
│   ├── phpmyadmin/                  # Configuración de PHPMyAdmin
│   ├── ssl/                         # Certificados SSL para HTTPS
│   └── volumes/                     # Volúmenes persistentes para datos
│       └── mariadb_data/            # Datos de la base de datos
├── packages/
│   ├── frontend/
│   │   ├── Dockerfile               # Configuración específica del frontend
│   │   └── ...
│   └── backend/
│       ├── Dockerfile               # Configuración específica del backend
│       └── ...
```

Esta organización sigue el principio de:
- **Archivos específicos de cada servicio**: Dockerfiles en sus respectivos paquetes
- **Configuración de orquestación**: Archivos docker-compose y configuraciones complementarias en `/docker`
- **Persistencia de datos**: Volúmenes centralizados en `/docker/volumes`
- **Seguridad**: Certificados SSL centralizados en `/docker/ssl`
- **Inicialización de base de datos**: Scripts SQL en `/docker/db/init`

### Archivos de Configuración Docker

#### Dockerfiles

- `packages/frontend/Dockerfile`: Configuración del contenedor de frontend basado en Node.js Alpine
- `packages/backend/Dockerfile`: Configuración del contenedor de backend con Node.js
- `docker/nginx/Dockerfile`: Configuración del servidor Nginx como proxy inverso

#### Docker Compose

Utilizamos diferentes archivos de composición para distintos entornos:

- `docker/docker-compose.yml`: Configuración base que define los servicios principales (db, backend, phpmyadmin)
- `docker/docker-compose.override.yml`: Configuración específica para desarrollo (hot-reloading, volúmenes, etc.)
- `docker/docker-compose.prod.yml`: Configuración específica para producción (optimización, SSL, etc.)

### Estructura de Contenedores

La arquitectura Docker del proyecto consta de los siguientes servicios:

1. **Frontend (Node.js)**
   - Sirve la aplicación React en desarrollo
   - Compila los assets estáticos para producción
   - Volúmenes montados para desarrollo en tiempo real

2. **Backend (Node.js)**
   - API REST con Express
   - Conexión a la base de datos mediante Prisma
   - Volúmenes montados para desarrollo en tiempo real

3. **Base de datos (MariaDB)**
   - Almacenamiento persistente mediante volúmenes Docker en `docker/volumes/mariadb_data`
   - Inicialización automática mediante scripts SQL en `docker/db/init`
   - Configuración de usuario, contraseña y base de datos inicial
   - Puerto expuesto para conexión desde herramientas externas

4. **PHPMyAdmin**
   - Interfaz web para administración de la base de datos
   - Accesible a través del proxy Nginx

5. **Nginx**
   - Servidor web que actúa como punto de entrada único
   - Gestión de certificados SSL ubicados en `docker/ssl`
   - Proxy inverso para el backend y PHPMyAdmin
   - Sirve los archivos estáticos del frontend en producción

### Modo Desarrollo vs. Producción

#### Entorno de Desarrollo

```bash
npm run docker-start
# o
make dev
```

En desarrollo:
- Frontend ejecuta webpack-dev-server con hot-reloading
- Los cambios en archivos de código se reflejan inmediatamente
- Los logs de todos los servicios se muestran en la consola
- Nginx sirve todo en HTTP para facilitar el desarrollo

#### Entorno de Producción

```bash
npm run docker-prod
# o
make prod
```

En producción:
- Frontend se compila como build estático
- Nginx sirve los archivos estáticos del frontend
- SSL habilitado con redirección HTTP a HTTPS
- Optimizaciones de rendimiento en todos los contenedores
- Configuración de seguridad reforzada

### Volúmenes y Persistencia

Definimos varios volúmenes Docker para garantizar la persistencia:

- `docker/volumes/mariadb_data`: Almacena la base de datos MySQL/MariaDB
- Volúmenes de código fuente: Permiten el desarrollo en tiempo real
- Volúmenes de configuración: Permiten modificar la configuración sin reconstruir los contenedores

Todos los datos persistentes se centralizan en la carpeta `docker/volumes` para una mejor organización y gestión de respaldos.

### Comunicación entre Servicios

Los contenedores se comunican a través de la red interna de Docker:
- El backend se conecta a la base de datos usando la URL `mysql://user:password@db:3306/dbname`
- El frontend se comunica con el backend a través de Nginx
- Nginx redirecciona las peticiones a `/api` hacia el backend

## Arquitectura

Este proyecto está estructurado como un monorepo con arquitectura hexagonal, utilizando:

- Frontend: React 19 con TypeScript
- Backend: Node.js con Express
- Base de datos: MySQL
- ORM: Prisma
- Gestión de monorepo: Lerna
- Contenedores: Docker

## Estructura del Proyecto

```
gestion-esports/
├── docker/                          # Configuración centralizada de Docker
│   ├── docker-compose.yml
│   ├── nginx/
│   ├── db/                          # Configuración y scripts de base de datos
│   │   └── init/                    # Scripts SQL de inicialización
│   │       └── db_schema.sql        # Esquema completo de la base de datos
│   ├── phpmyadmin/
│   ├── ssl/                         # Certificados SSL
│   └── volumes/                     # Volúmenes persistentes
├── packages/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── domain/ (entidades, interfaces de repositorios)
│   │   │   ├── application/ (casos de uso, servicios de aplicación)
│   │   │   ├── infrastructure/ (implementaciones concretas, API)
│   │   │   ├── ui/ (componentes visuales, rutas)
│   │   │   ├── shared/ (utilidades compartidas)
│   │   │   └── i18n/ (traducciones)
│   │   ├── Dockerfile               # Configuración específica del frontend
│   │   └── ...
│   └── backend/
│       ├── src/
│       │   ├── domain/ (entidades, interfaces de repositorios)
│       │   ├── application/ (casos de uso, servicios de aplicación)
│       │   ├── infrastructure/ (controladores, rutas, DB)
│       │   └── shared/ (utilidades, configuraciones)
│       ├── prisma/ (esquemas de base de datos)
│       ├── Dockerfile               # Configuración específica del backend
│       └── ...
└── .husky/ (Git hooks)
```

## Modelo de Datos

El proyecto utiliza Prisma como ORM con MySQL. Modelos principales:

- **User**: Gestión de usuarios con roles y autenticación
- **Team**: Gestión de equipos de esports

El esquema completo de la base de datos se encuentra en los scripts SQL de inicialización en `docker/db/init/`.

## Comandos Disponibles

```bash
# Instalar dependencias en todos los paquetes
npm run bootstrap

# Iniciar el frontend en modo desarrollo
npm run start:frontend

# Iniciar el backend en modo desarrollo
npm run start:backend

# Compilar todos los paquetes
npm run build

# Ejecutar pruebas en todos los paquetes
npm run test

# Ejecutar linter en todos los paquetes
npm run lint

# Iniciar entorno Docker en desarrollo
npm run docker-start
# o
make dev

# Iniciar entorno Docker en producción
npm run docker-prod
# o
make prod

# Detener y eliminar contenedores Docker
npm run docker-down
# o
make clean

# Crear un commit con formato convencional
npm run commit
# o
make commit
```

### Scripts de Prisma (Backend)

Para gestionar la base de datos a través de Prisma ORM, se han añadido los siguientes comandos:

```bash
# Generar el cliente Prisma basado en el esquema
cd packages/backend && npm run prisma:generate
# o usando lerna
npx lerna run --scope=@gestion-esports/backend prisma:generate

# Crear y aplicar migraciones en desarrollo
cd packages/backend && npm run prisma:migrate
# o usando lerna
npx lerna run --scope=@gestion-esports/backend prisma:migrate

# Iniciar Prisma Studio (interfaz visual para la BD)
cd packages/backend && npm run prisma:studio
# o usando lerna
npx lerna run --scope=@gestion-esports/backend prisma:studio

# Formatear el archivo schema.prisma
cd packages/backend && npm run prisma:format
# o usando lerna
npx lerna run --scope=@gestion-esports/backend prisma:format

# Aplicar cambios directamente a la BD sin migraciones
cd packages/backend && npm run prisma:push
# o usando lerna
npx lerna run --scope=@gestion-esports/backend prisma:push
```

## Tecnologías Principales

### Frontend
- React 19
- TypeScript
- Redux Toolkit
- React Router v7
- Bootstrap 5.3
- i18next para internacionalización
- Axios para peticiones HTTP
- Webpack 5
- Jest y Testing Library para pruebas
- Cypress para pruebas E2E

### Backend
- Node.js
- Express
- Prisma ORM
  - Cliente generado para tipo seguro
  - Prisma Studio para visualización de datos
  - Migraciones automatizadas
- MySQL
- JWT para autenticación

### DevOps
- Docker y Docker Compose
- Nginx como servidor web y proxy reverso
- GitHub Actions para CI/CD

## Control de Calidad

### Git Hooks y Commits Estandarizados
- **Husky**: Gestiona los Git hooks para validaciones previas a los commits
- **Commitizen**: Formato estandarizado de commits siguiendo Conventional Commits
- **Lint-staged**: Ejecuta linters y formatters solo en archivos modificados

El proceso de pre-commit incluye:
1. Ejecución de lint-staged para validar archivos modificados
2. Ejecución de pruebas automáticas
3. Verificación de cobertura de código (mínimo 80%)

Para crear un nuevo commit, usar `npm run commit` en lugar de `git commit` para seguir el formato convencional.

## Seguridad
- Implementación de reCAPTCHA para formularios
- Análisis de fortaleza de contraseñas con zxcvbn
- HTTPS con certificados SSL almacenados en `docker/ssl`

## Despliegue

El proyecto está configurado para ser desplegado con Docker:

1. Asegúrate de tener Docker y Docker Compose instalados
2. Ejecuta `npm run docker-prod` o `make prod` para iniciar en modo producción
3. La aplicación estará disponible en:
   - Frontend: https://localhost
   - Backend API: https://localhost/api
   - PhpMyAdmin: https://localhost/phpmyadmin

### Acceso a PHPMyAdmin

Para gestionar la base de datos, el proyecto incluye PHPMyAdmin accesible desde:

```
https://localhost/phpmyadmin
```

Credenciales:
- **Usuario**: root
- **Contraseña**: rootpassword

O también puedes acceder con el usuario normal:
- **Usuario**: admin
- **Contraseña**: a/dmi.n45_&ssHG$ass

PHPMyAdmin está configurado con las siguientes características:
- Acceso solo mediante HTTPS
- Tiempo de sesión limitado (5 minutos)
- Protecciones contra operaciones peligrosas
- Interfaz en español

### Esquema de Redirecciones y URLs de Acceso

El proyecto utiliza Nginx como proxy inverso para dirigir el tráfico a los diferentes servicios. A continuación se detalla cómo acceder a cada servicio tanto desde el host como desde dentro de los contenedores:

#### Acceso desde el host (navegador/máquina local)

| Servicio    | URL/Puerto               | Descripción                                |
|-------------|--------------------------|-------------------------------------------|
| Frontend    | `https://localhost/`     | Interfaz de usuario de la aplicación       |
| Backend API | `https://localhost/api/` | API REST para operaciones del backend      |
| PHPMyAdmin  | `https://localhost/phpmyadmin/` | Administración de base de datos     |
| WebSockets  | `https://localhost/ws`   | Conexión WebSocket para desarrollo (HMR)   |
| MariaDB     | `localhost:3306`         | Acceso directo a la base de datos          |

#### Acceso desde el contenedor Frontend

| Destino     | URL/Comando                                   | Descripción                     |
|-------------|-----------------------------------------------|--------------------------------|
| Backend     | `http://backend:3000/api/`                    | Comunicación con la API        |
| MariaDB     | `mysql -h db -uadmin -p gestion_esports`      | Acceso directo a la BD         |
| PHPMyAdmin  | `curl http://phpmyadmin:80/`                  | Acceso a phpMyAdmin (solo HTTP)|

#### Acceso desde el contenedor Backend

| Destino     | URL/Configuración                                  | Descripción                    |
|-------------|----------------------------------------------------|--------------------------------|
| MariaDB     | `mysql://admin:password@db:3306/gestion_esports`   | Conexión a la base de datos    |
| Frontend    | `http://frontend:3000`                             | Acceso al frontend (raramente necesario) |

#### Acceso desde el contenedor PHPMyAdmin

| Destino     | Configuración            | Descripción                                |
|-------------|--------------------------|-------------------------------------------|
| MariaDB     | `PMA_HOST=db`            | Configuración automática en docker-compose |

#### Nombres de red internos (DNS Docker)

Todos los contenedores pueden comunicarse entre sí utilizando sus nombres de servicio:

- `frontend` → Servicio de frontend (React)
- `backend` → Servicio de API (Node.js/Express)
- `phpmyadmin` → Servicio de administración de BD
- `db` → Servicio de base de datos (MariaDB)
- `nginx` → Proxy inverso

#### Configuración de redirecciones en Nginx

```nginx
# Frontend (React)
location / {
  proxy_pass http://frontend:3000;
}

# WebSockets para Hot Module Replacement
location /ws {
  proxy_pass http://frontend:3000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
}

# Backend API (Node.js)
location /api/ {
  proxy_pass http://backend:3000/api/;
}

# PHPMyAdmin
location /phpmyadmin/ {
  rewrite ^/phpmyadmin/(.*)$ /$1 break;
  proxy_pass http://phpmyadmin:80/;
}
```

## Variables de Entorno

Este proyecto utiliza archivos `.env` para configurar distintos entornos. A continuación se documentan todas las variables necesarias para cada package:

### Frontend (`packages/frontend`)

| Variable                        | Descripción                                                        | Sensible |
|----------------------------------|--------------------------------------------------------------------|:--------:|
| APP_LANG                        | Idioma por defecto de la aplicación                                |    No    |
| AUTH_TOKEN_KEY                  | Nombre de la clave del token de autenticación en localStorage      |    No    |
| CYPRESS_BASE_URL                | URL base para tests E2E con Cypress                                |    No    |
| NODE_ENV                        | Entorno de ejecución (`development`, `production`, etc.)           |    No    |
| REACT_APP_API_TIMEOUT           | Timeout para peticiones HTTP (ms)                                  |    No    |
| REACT_APP_API_URL               | URL base de la API backend                                         |    No    |
| REACT_APP_ENABLE_ANALYTICS      | Habilita/deshabilita analíticas                                    |    No    |
| REACT_APP_ENABLE_DEBUG_TOOLS    | Habilita herramientas de debug                                     |    No    |
| REACT_APP_ENABLE_WEB_VITALS     | Habilita métricas de rendimiento                                   |    No    |
| REACT_APP_ENV                   | Entorno React (`development`, `production`, etc.)                  |    No    |
| REACT_APP_PORT                  | Puerto del servidor de desarrollo React                            |    No    |
| REACT_APP_RECAPTCHA_SITE_KEY    | Clave pública de Google reCAPTCHA                                  |    No    |
| REACT_APP_WDS_SOCKET_PORT       | Puerto para Webpack Dev Server (HMR)                               |    No    |
| REFRESH_TOKEN_KEY               | Nombre de la clave del refresh token en localStorage               |    No    |

> **Nota:** No incluyas nunca secretos ni contraseñas en el frontend. Todas las variables sensibles deben estar solo en el backend.

### Backend (`packages/backend`)

| Variable           | Descripción                                                        | Sensible |
|--------------------|--------------------------------------------------------------------|:--------:|
| COOKIE_MAX_AGE     | Tiempo de vida de la cookie (ms)                                   |    No    |
| COOKIE_SECRET      | Secreto para cookies                                               |   Sí     |
| CORS_ORIGIN        | Origen permitido para CORS                                         |    No    |
| DATABASE_URL       | URL de conexión a la base de datos                                 |   Sí     |
| FRONTEND_URL       | URL pública del frontend                                           |    No    |
| JWT_EXPIRES_IN     | Tiempo de expiración de los JWT                                    |    No    |
| JWT_SECRET         | Secreto para firmar JWT                                            |   Sí     |
| MAIL_FROM          | Email remitente                                                    |    No    |
| MAIL_HOST          | Host del servidor SMTP                                             |   Sí     |
| MAIL_PASSWORD      | Contraseña SMTP                                                    |   Sí     |
| MAIL_PORT          | Puerto del servidor SMTP                                           |    No    |
| MAIL_USER          | Usuario SMTP                                                       |   Sí     |
| NODE_ENV           | Entorno de ejecución (`development`, `production`, etc.)           |    No    |
| PORT               | Puerto donde se ejecuta el backend                                 |    No    |
| SESSION_SECRET     | Secreto para sesiones                                              |   Sí     |

> **Variables sensibles:** Nunca incluyas valores reales de estas variables en el repositorio. Configúralas directamente en Heroku o en tu entorno seguro de producción.

## Requisitos

- Node.js 18+
- NPM 8+
- Docker y Docker Compose (para despliegue)
- MySQL (o usar la versión dockerizada)

## Licencia

ISC

## Convención de nombres para componentes UI

- **Directorios de componentes:** Utiliza **PascalCase** para los nombres de carpetas que contienen componentes React.
  - Ejemplo: `Button/`, `UserProfile/`, `LoginForm/`
- **Archivos de componentes:** Utiliza **PascalCase** para los archivos principales del componente.
  - Ejemplo: `Button.tsx`, `UserProfile.tsx`
- **Carpetas agrupadoras:** Si una carpeta agrupa varios componentes relacionados (por ejemplo, formularios), también usa PascalCase: `Forms/`

> Esta convención ayuda a mantener el código consistente y fácil de navegar para todo el equipo.

## Convención de nombres para páginas y layouts

- **Directorios de páginas:** Todos los directorios deben terminar en `Page`.
  - Ejemplo: `LoginPage/`, `RegisterPage/`, `DashboardPage/`
- **Directorios de layouts:** Todos los directorios deben terminar en `Layout`.
  - Ejemplo: `MainLayout/`, `PublicLayout/`

> Esta convención facilita la navegación y el mantenimiento del código, y ayuda a distinguir claramente entre páginas, layouts y otros componentes.

## Otras convenciones para calidad de código

### Nombres de archivos
- **Componentes React:** PascalCase (`LoginForm.tsx`, `UserProfileCard.tsx`)
- **Hooks personalizados:** Prefijo `use` y camelCase (`useAuth.ts`, `useToast.ts`)
- **Utilidades/helpers:** camelCase (`formatDate.ts`, `parseJwt.ts`)

### Exportaciones
- **Componentes principales:** Exportación por defecto
- **Utilidades, hooks y constantes:** Exportaciones nombradas

### Tests
- Ubica los tests en una subcarpeta `__tests__` junto al componente/página
- Nombra los archivos de test igual que el componente: `LoginForm.test.tsx`

### Rutas de imports
- Usa imports absolutos con alias (`@ui/components/Button`)

### Nombres de variables y funciones
- **Variables/funciones:** camelCase (`userProfile`, `getUserData`)
- **Clases/tipos:** PascalCase (`User`, `UserProfile`)
- **Constantes:** MAYÚSCULAS_CON_GUIONES (`API_URL`)

### Manejo de errores
- Captura y maneja errores en promesas/async
- Usa mensajes de error claros y traducibles (i18n)

### Estilos y CSS
- Si usas CSS Modules: nombra igual que el componente (`LoginForm.module.css`)
- Si usas styled-components, agrupa estilos en el mismo archivo o en `styles/`

### Estructura de carpetas
- Mantén la estructura hexagonal/limpia: `domain/`, `application/`, `infrastructure/`, `ui/`, `shared/`
- No mezcles lógica de dominio con presentación

### Documentación
- Añade comentarios JSDoc en funciones, clases y métodos públicos
- Documenta los props de los componentes y los tipos de datos

### Commits
- Usa Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, etc.) para los mensajes de commit

> Seguir estas convenciones ayuda a mantener un código profesional, escalable y fácil de entender para todo el equipo.
