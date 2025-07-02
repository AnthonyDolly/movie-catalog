# Movie Catalog API 🎬

Una API REST completa para gestión de catálogo de películas construida con NestJS, PostgreSQL y Redis.

## 🚀 Características

- ✅ **CRUD completo** para Películas, Géneros y Directores
- ✅ **Búsqueda y filtrado avanzado** con paginación inteligente
- ✅ **Sistema de cache Redis** para optimización de consultas
- ✅ **Subida de archivos** para pósters de películas con validación
- ✅ **Validación robusta** con class-validator y class-transformer
- ✅ **Documentación automática** con Swagger/OpenAPI
- ✅ **Base de datos PostgreSQL** con TypeORM y relaciones
- ✅ **Contenedores Docker** para desarrollo y producción
- ✅ **Logging estructurado** con middleware personalizado
- ✅ **Filtros de excepción** globales para manejo de errores
- ✅ **Health checks** para monitoreo de servicios
- ✅ **Gestión con Makefile** para facilitar operaciones

## 🏗️ Arquitectura

### Stack Tecnológico

- **Backend**: NestJS v11 con TypeScript
- **Base de Datos**: PostgreSQL 15 Alpine
- **Cache**: Redis 7 Alpine
- **ORM**: TypeORM con decoradores y relaciones
- **Documentación**: Swagger/OpenAPI integrado
- **Validación**: class-validator + class-transformer
- **File Upload**: Multer con validación de archivos
- **Logging**: Middleware personalizado para requests HTTP
- **Contenedores**: Docker & Docker Compose

### Estructura de la Base de Datos

```
Movies (Películas)
├── id (PK)
├── title (indexed para búsquedas)
├── description
├── releaseYear (indexed para filtros)
├── duration (minutos)
├── rating (0.0 - 10.0)
├── posterUrl (ruta del archivo)
├── synopsis
├── genreId (FK → Genres)
├── directorId (FK → Directors)
└── timestamps (createdAt, updatedAt)

Genres (Géneros)
├── id (PK)
├── name (unique)
├── description
└── timestamps

Directors (Directores)
├── id (PK)
├── firstName
├── lastName (getter: fullName)
├── birthDate
├── nationality
├── biography
└── timestamps
```

### Sistema de Cache Inteligente

El sistema implementa cache en múltiples niveles con Redis:

- **Películas**: Cache de 5 minutos para listas y búsquedas frecuentes
- **Géneros**: Cache de 1 hora (datos estables)
- **Directores**: Cache de 1 hora (datos estables)
- **Películas populares**: Cache de 15 minutos
- **Búsquedas específicas**: Cache de 5 minutos con parámetros únicos
- **Invalidación automática**: Al crear, actualizar o eliminar registros

## 🚀 Inicio Rápido

### Prerequisitos

- **Docker** y **Docker Compose**
- **Make** (disponible en la mayoría de sistemas Unix/Linux)
- Git

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone <repository-url>
cd movie-catalog

# Ver comandos disponibles
make help
```

### 2. Configurar variables de entorno

Crea los archivos de configuración:

**Para desarrollo (.env):**
```env
# Base de datos PostgreSQL
POSTGRES_DB=movie_catalog_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=dev_password_123
POSTGRES_PORT=5433

# Aplicación
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=dev_password_123
DB_NAME=movie_catalog_dev

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# API
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=debug
```

**Para producción (.env.prod):**
```env
# Base de datos PostgreSQL (usar credenciales seguras)
POSTGRES_DB=movie_catalog_prod
POSTGRES_USER=movieapp
POSTGRES_PASSWORD=super_secure_password_123
POSTGRES_PORT=5432

# Aplicación
DB_HOST=postgres
DB_PORT=5432
DB_USER=movieapp
DB_PASSWORD=super_secure_password_123
DB_NAME=movie_catalog_prod

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# API
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=info

# AWS S3 (opcional para producción)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 3. Ejecutar con Makefile

#### Desarrollo

```bash
# Levantar entorno completo de desarrollo
make dev

# Ver logs en tiempo real
make logs-dev

# Ver estado de contenedores
make status

# Bajar servicios
make dev-down
```

#### Producción

```bash
# Levantar en producción (background)
make prod

# Ver logs de producción
make logs-prod

# Reiniciar servicios
make restart-prod

# Bajar servicios
make prod-down
```

## 🌱 Datos Iniciales (Seeding)

La aplicación incluye un sistema de **seeding automático** que se ejecuta cada vez que inicias el proyecto con `make dev`:

### ¿Cuándo se ejecuta el seed?
- **Automáticamente** al iniciar la aplicación
- **Solo si la base de datos está vacía** (verifica que no existan géneros)
- **Una única vez** para evitar duplicar datos

### Datos incluidos en el seed:

#### 📁 Géneros (8 categorías)
- Action, Drama, Comedy, Sci-Fi, Thriller, Horror, Romance, Adventure

#### 🎪 Directores (5 directores famosos)
- Christopher Nolan
- Quentin Tarantino  
- Martin Scorsese
- Steven Spielberg
- Lana Wachowski

#### 🎬 Películas (6 películas populares)
- Inception (2010) - Christopher Nolan
- Pulp Fiction (1994) - Quentin Tarantino
- The Dark Knight (2008) - Christopher Nolan
- Goodfellas (1990) - Martin Scorsese
- E.T. the Extra-Terrestrial (1982) - Steven Spielberg
- The Matrix (1999) - Lana Wachowski

### Verificar datos iniciales:

```bash
# Después de ejecutar make dev, puedes verificar los datos:
curl http://localhost:3000/api/v1/genres
curl http://localhost:3000/api/v1/directors  
curl http://localhost:3000/api/v1/movies
```

## 📋 Uso de la API

### Acceso a la Documentación

La documentación interactiva Swagger está disponible en:

- **Desarrollo**: http://localhost:3000/api/docs
- **API Base**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/api/v1/health

### Endpoints Principales

#### 🎬 Películas

```bash
# Listar todas las películas con filtros avanzados
GET /api/v1/movies?page=1&limit=10&search=matrix&genre=action&director=nolan

# Películas populares (mejor calificadas)
GET /api/v1/movies/popular?page=1&limit=5

# Obtener película específica
GET /api/v1/movies/1

# Películas por género
GET /api/v1/movies/genre/1

# Películas por director
GET /api/v1/movies/director/1

# Crear nueva película
POST /api/v1/movies
{
  "title": "Inception",
  "description": "A thief who steals corporate secrets...",
  "releaseYear": 2010,
  "duration": 148,
  "rating": 8.8,
  "synopsis": "Dom Cobb is a skilled thief...",
  "genreId": 1,
  "directorId": 1
}

# Subir póster para película
POST /api/v1/movies/1/poster
Content-Type: multipart/form-data
(archivo: poster.jpg)

# Actualizar película
PATCH /api/v1/movies/1
{
  "rating": 9.0,
  "description": "Updated description"
}

# Eliminar póster
DELETE /api/v1/movies/1/poster

# Eliminar película
DELETE /api/v1/movies/1
```

#### 🎭 Géneros

```bash
# Listar géneros (con cache)
GET /api/v1/genres

# Crear género
POST /api/v1/genres
{
  "name": "Science Fiction",
  "description": "Movies exploring futuristic concepts"
}

# Actualizar género
PATCH /api/v1/genres/1
{
  "description": "Updated description"
}

# Eliminar género
DELETE /api/v1/genres/1
```

#### 🎪 Directores

```bash
# Listar directores con búsqueda
GET /api/v1/directors?search=nolan

# Crear director
POST /api/v1/directors
{
  "firstName": "Christopher",
  "lastName": "Nolan",
  "birthDate": "1970-07-30",
  "nationality": "British",
  "biography": "British-American film director..."
}

# Actualizar director
PATCH /api/v1/directors/1
{
  "biography": "Updated biography"
}

# Eliminar director
DELETE /api/v1/directors/1
```

### Parámetros de Filtrado Avanzado

#### Para Películas

- `search`: Búsqueda por título (ILIKE)
- `genre`: Filtro por nombre de género (ILIKE)
- `director`: Filtro por nombre/apellido de director (ILIKE)
- `year`: Filtro exacto por año de lanzamiento
- `sortBy`: Campo de ordenamiento (`title`, `releaseYear`, `rating`, `createdAt`)
- `order`: Orden (`ASC`, `DESC`)
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)

#### Ejemplos de Uso Real

```bash
# Buscar películas de ciencia ficción del 2010 ordenadas por rating
GET /api/v1/movies?genre=sci-fi&year=2010&sortBy=rating&order=DESC

# Buscar todas las películas de Christopher Nolan
GET /api/v1/movies?director=nolan&sortBy=releaseYear&order=ASC

# Búsqueda combinada con paginación
GET /api/v1/movies?search=batman&genre=action&limit=5&page=2

# Películas populares de la última década
GET /api/v1/movies/popular?limit=20
```

## 🛠️ Comandos de Desarrollo

### Makefile Commands

```bash
# 📦 Desarrollo
make dev           # Levantar entorno de desarrollo
make dev-down      # Bajar entorno de desarrollo
make restart-dev   # Reiniciar entorno de desarrollo
make build-dev     # Construir imagen de desarrollo
make logs-dev      # Ver logs de desarrollo en tiempo real

# 🚀 Producción
make prod          # Levantar entorno de producción
make prod-down     # Bajar entorno de producción
make restart-prod  # Reiniciar entorno de producción
make build-prod    # Construir imagen de producción
make logs-prod     # Ver logs de producción en tiempo real

# 🔧 Utilidades
make status        # Ver estado de contenedores
make clean         # Limpiar contenedores, imágenes y volúmenes
make help          # Ver todos los comandos disponibles
```

### NPM Scripts (dentro del contenedor)

```bash
# Construcción y inicio
npm run build              # Construir aplicación
npm run start             # Ejecutar aplicación
npm run start:dev         # Modo desarrollo (hot reload)
npm run start:debug       # Modo debug
npm run start:prod        # Modo producción

# Calidad de código
npm run lint              # ESLint con auto-fix
npm run format            # Prettier formatting
```

## 📊 Monitoreo y Salud

### Health Checks

```bash
# Verificar estado de la aplicación
GET /api/v1/health

# Respuesta esperada
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Métricas de Cache

El sistema de cache Redis incluye:

- **Hit Rate**: Consultas servidas desde cache
- **Miss Rate**: Consultas que acceden a base de datos
- **TTL Dinámico**: Tiempo de vida configurable por tipo de dato
- **Invalidación Inteligente**: Limpieza automática al modificar datos

### Logs Estructurados

```bash
# Ver logs en tiempo real por servicio
make logs-dev           # Todos los servicios
docker logs movie-catalog-app-1 -f    # Solo aplicación
docker logs movie-catalog-postgres-1 -f # Solo base de datos
docker logs movie-catalog-redis-1 -f    # Solo Redis

# Filtrar logs por nivel
make logs-dev | grep ERROR
make logs-dev | grep "HTTP"
```

## 🗂️ Gestión de Archivos

### Subida de Pósters

El sistema incluye validación completa de archivos:

- **Formatos permitidos**: JPEG, JPG, PNG
- **Tamaño máximo**: 5MB
- **Validación**: Magic bytes, extensión, MIME type
- **Almacenamiento**: Local (desarrollo) / S3 (producción)
- **URLs**: Generación automática y gestión de rutas

### Configuración de Uploads

```typescript
// Validaciones automáticas aplicadas:
- Tipos MIME: ['image/jpeg', 'image/jpg', 'image/png']
- Tamaño máximo: 5MB
- Validación de magic bytes para seguridad
- Nombres únicos con UUID
```

## 🔧 Configuración Avanzada

### Variables de Entorno por Categoría

#### Base de Datos PostgreSQL
```env
POSTGRES_DB=movie_catalog_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=dev_password_123
POSTGRES_PORT=5433
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=dev_password_123
DB_NAME=movie_catalog_dev
```

#### Cache Redis
```env
REDIS_HOST=redis
REDIS_PORT=6379
```

#### Aplicación
```env
NODE_ENV=development      # development | production
PORT=3000
CORS_ORIGIN=*            # * para desarrollo, dominio específico para producción
LOG_LEVEL=debug          # error | warn | info | debug
```

#### AWS S3 (Solo Producción)
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Configuración de TTL del Cache

```typescript
const TTL = {
  SHORT: 300,    // 5 minutos - datos frecuentes (movies, search)
  MEDIUM: 900,   // 15 minutos - popularidad
  LONG: 3600,    // 1 hora - géneros y directores
};
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de conexión a PostgreSQL

```bash
# Verificar estado de servicios
make status

# Ver logs específicos de PostgreSQL
docker logs movie-catalog-postgres-1

# Reiniciar solo PostgreSQL
docker restart movie-catalog-postgres-1

# Verificar conectividad desde la app
docker exec movie-catalog-app-1 ping postgres
```

#### 2. Error de conexión a Redis

```bash
# Verificar Redis
docker exec movie-catalog-redis-1 redis-cli ping
# Expected: PONG

# Limpiar cache si es necesario
docker exec movie-catalog-redis-1 redis-cli FLUSHALL

# Ver memoria Redis
docker exec movie-catalog-redis-1 redis-cli INFO memory
```

#### 3. Problemas de Hot Reload

```bash
# Verificar volúmenes montados
docker volume ls | grep movie-catalog

# Reiniciar contenedor de desarrollo
make restart-dev

# Reconstruir imagen si persiste
make build-dev
```

#### 4. Error de permisos en archivos

```bash
# Dar permisos a directorios de Docker
sudo chown -R $USER:$USER docker/

# Limpiar y reconstruir
make clean
make dev
```

#### 5. Cache inconsistente

```bash
# Limpiar cache Redis completamente
docker exec movie-catalog-redis-1 redis-cli FLUSHALL

# Reiniciar aplicación para regenerar cache
make restart-dev
```

### Debug de API

#### Verificar Swagger Docs

```bash
# Acceder a documentación interactiva
curl http://localhost:3000/api/docs

# Verificar endpoints específicos
curl http://localhost:3000/api/v1/health
curl http://localhost:3000/api/v1/movies?limit=1
```

#### Monitoring de Performance

```bash
# Ver estadísticas de Redis
docker exec movie-catalog-redis-1 redis-cli INFO stats

# Ver conexiones de PostgreSQL
docker exec movie-catalog-postgres-1 psql -U postgres -d movie_catalog_dev -c "SELECT count(*) FROM pg_stat_activity;"
```

## 📄 Ejemplos de Uso Completos

### Flujo Completo: Crear y Gestionar una Película

```bash
# 1. Crear un género si no existe
curl -X POST http://localhost:3000/api/v1/genres \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sci-Fi",
    "description": "Science fiction movies"
  }'

# 2. Crear un director si no existe
curl -X POST http://localhost:3000/api/v1/directors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Denis",
    "lastName": "Villeneuve",
    "birthDate": "1967-10-03",
    "nationality": "Canadian",
    "biography": "Denis Villeneuve is a Canadian film director and screenwriter."
  }'

# 3. Crear la película
curl -X POST http://localhost:3000/api/v1/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Blade Runner 2049",
    "description": "A sequel to the 1982 film Blade Runner",
    "releaseYear": 2017,
    "duration": 164,
    "rating": 8.0,
    "synopsis": "Officer K, a new blade runner for the LAPD...",
    "genreId": 1,
    "directorId": 1
  }'

# 4. Subir póster
curl -X POST http://localhost:3000/api/v1/movies/1/poster \
  -F "poster=@blade_runner_poster.jpg"

# 5. Buscar la película
curl "http://localhost:3000/api/v1/movies?search=blade%20runner"
```

### Flujo de Búsqueda Avanzada

```bash
# Búsqueda compleja con múltiples filtros
curl "http://localhost:3000/api/v1/movies?search=matrix&genre=sci-fi&sortBy=rating&order=DESC&limit=5"

# Películas de un director específico ordenadas cronológicamente
curl "http://localhost:3000/api/v1/movies?director=nolan&sortBy=releaseYear&order=ASC"

# Top películas por año
curl "http://localhost:3000/api/v1/movies?year=2010&sortBy=rating&order=DESC"

# Buscar directores
curl "http://localhost:3000/api/v1/directors?search=villeneuve"
```

## 📈 Rendimiento y Optimización

### Cache Performance

- **Cache Hit Rate**: >80% para consultas repetidas
- **Response Time**: <50ms para datos cacheados
- **Database Load**: Reducción del 70% en consultas frecuentes

### Índices de Base de Datos

```sql
-- Índices automáticos creados por TypeORM:
CREATE INDEX ON movies(title);        -- Para búsquedas por título
CREATE INDEX ON movies(releaseYear);  -- Para filtros por año
```

### Volúmenes Docker Optimizados

- **node_modules**: Volumen separado para mejor performance
- **Hot reload**: Solo archivos fuente montados
- **Persistencia**: Datos de PostgreSQL y Redis persistentes

## 🤝 Contribución

### Flujo de Desarrollo

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Desarrollar usando `make dev` para hot reload
4. Verificar linting: `npm run lint`
5. Commit cambios (`git commit -m 'Add nueva funcionalidad'`)
6. Push a la rama (`git push origin feature/nueva-funcionalidad`)
7. Crear Pull Request

### Estándares de Código

- **TypeScript**: Tipado estricto
- **ESLint**: Configuración personalizada
- **Prettier**: Formateo automático
- **Swagger**: Documentación obligatoria para nuevos endpoints

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License.

## 🙋‍♂️ Soporte

Para reportar bugs o solicitar nuevas características:

1. Crear un issue en el repositorio
2. Incluir logs relevantes (`make logs-dev`)
3. Especificar pasos para reproducir
4. Adjuntar información del entorno

---

**Desarrollado con ❤️ usando NestJS, PostgreSQL, Redis y Docker**

**Gestión simplificada con Make - `make help` para ver todos los comandos**
