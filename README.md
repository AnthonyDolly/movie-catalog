# Movie Catalog API 🎬

Una API REST completa para gestión de catálogo de películas construida con NestJS, PostgreSQL y Redis.

## 🚀 Características

- ✅ **CRUD completo** para Películas, Géneros y Directores
- ✅ **Búsqueda y filtrado avanzado** con paginación
- ✅ **Validación robusta** con class-validator
- ✅ **Documentación automática** con Swagger/OpenAPI
- ✅ **Cache inteligente** con Redis para listas frecuentes
- ✅ **Base de datos** PostgreSQL con TypeORM
- ✅ **Contenedores Docker** para desarrollo y producción
- ✅ **Logging** estructurado con Winston
- ✅ **Filtros de excepción** globales
- ✅ **Endpoints de salud** para monitoreo

## 🏗️ Arquitectura

### Stack Tecnológico

- **Backend**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: TypeORM
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator
- **Logging**: Winston
- **Contenedores**: Docker & Docker Compose

### Estructura de la Base de Datos

```
Movies (Películas)
├── id (PK)
├── title
├── description
├── releaseYear
├── duration
├── rating
├── posterUrl
├── synopsis
├── genreId (FK → Genres)
├── directorId (FK → Directors)
└── timestamps

Genres (Géneros)
├── id (PK)
├── name
├── description
└── timestamps

Directors (Directores)
├── id (PK)
├── firstName
├── lastName
├── birthDate
├── nationality
├── biography
└── timestamps
```

### Sistema de Cache

El sistema implementa cache inteligente con Redis para optimizar consultas frecuentes:

- **Películas**: Cache de 5 minutos para listas y búsquedas
- **Géneros**: Cache de 1 hora (datos estables)
- **Directores**: Cache de 1 hora (datos estables)
- **Películas populares**: Cache de 15 minutos
- **Invalidación automática**: Al crear, actualizar o eliminar registros

## 🚀 Instalación y Configuración

### Prerequisitos

- Docker y Docker Compose
- Node.js 20+ (opcional, para desarrollo local)

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd movie-catalog
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables según tu entorno
nano .env
```

### 3. Ejecutar con Docker (Recomendado)

#### Desarrollo

```bash
# Construir y ejecutar servicios de desarrollo
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down
```

#### Producción

```bash
# Configurar variables de producción
cp .env.example .env.prod
nano .env.prod

# Ejecutar en producción
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Desarrollo local (Opcional)

```bash
npm install
npm run start:dev
```

## 📋 Uso de la API

### Swagger UI

La documentación interactiva está disponible en:

- Desarrollo: http://localhost:3000/api
- Producción: http://your-domain/api

### Endpoints Principales

#### Películas

```bash
# Listar todas las películas (con cache)
GET /movies?page=1&limit=10&search=matrix

# Películas populares (con cache)
GET /movies/popular

# Obtener película por ID
GET /movies/{id}

# Películas por género (con cache)
GET /movies/genre/{genreId}

# Películas por director (con cache)
GET /movies/director/{directorId}

# Crear película
POST /movies

# Actualizar película
PATCH /movies/{id}

# Eliminar película
DELETE /movies/{id}
```

#### Géneros

```bash
# Listar géneros (con cache)
GET /genres

# Crear género
POST /genres

# Actualizar género
PATCH /genres/{id}

# Eliminar género
DELETE /genres/{id}
```

#### Directores

```bash
# Listar directores (con cache)
GET /directors

# Crear director
POST /directors

# Actualizar director
PATCH /directors/{id}

# Eliminar director
DELETE /directors/{id}
```

### Parámetros de Filtrado y Búsqueda

#### Películas

- `search`: Búsqueda por título
- `genre`: Filtro por nombre de género
- `director`: Filtro por nombre de director
- `year`: Filtro por año de lanzamiento
- `sortBy`: Campo de ordenamiento (`title`, `releaseYear`, `rating`, `createdAt`)
- `order`: Orden (`ASC`, `DESC`)
- `page`: Número de página
- `limit`: Elementos por página

#### Ejemplos

```bash
# Buscar películas de acción del 2020
GET /movies?genre=action&year=2020

# Buscar películas de Christopher Nolan
GET /movies?director=nolan

# Películas ordenadas por rating descendente
GET /movies?sortBy=rating&order=DESC

# Búsqueda combinada
GET /movies?search=batman&genre=action&sortBy=releaseYear&order=DESC
```

## 🧪 Comandos de Desarrollo

```bash
# Desarrollo
npm run start:dev          # Modo desarrollo con hot reload
npm run start:debug        # Modo debug

# Producción
npm run build              # Construir aplicación
npm run start:prod         # Ejecutar en producción

# Calidad de código
npm run lint               # ESLint
npm run format             # Prettier
```

## 🐳 Comandos Docker

### Desarrollo

```bash
# Construir y ejecutar
docker-compose up -d

# Rebuild completo
docker-compose up --build -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

### Producción

```bash
# Ejecutar en producción
docker-compose -f docker-compose.prod.yml up -d

# Escalado
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Backup de base de datos
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres movie_catalog > backup.sql
```

## 📊 Monitoreo y Salud

### Health Check

```bash
# Verificar estado de la aplicación
GET /health

# Respuesta esperada
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

### Cache Stats

El cache Redis mantiene estadísticas automáticas:

- **Hit Rate**: Porcentaje de consultas servidas desde cache
- **Miss Rate**: Consultas que requirieron acceso a base de datos
- **TTL**: Tiempo de vida configurable por tipo de dato

### Logs

```bash
# Ver logs de aplicación
docker-compose logs -f app

# Ver logs de base de datos
docker-compose logs -f postgres

# Ver logs de Redis
docker-compose logs -f redis

# Filtrar por nivel
docker-compose logs -f app | grep ERROR
```

## 🔧 Configuración Avanzada

### Variables de Entorno

#### Base de Datos

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=movie_catalog
```

#### Cache Redis

```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=         # Opcional
```

#### Aplicación

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=debug
```

### Configuración del Cache

```typescript
// TTL por tipo de dato
const TTL = {
  SHORT: 300, // 5 minutos - datos frecuentes
  MEDIUM: 900, // 15 minutos - datos moderadamente estables
  LONG: 3600, // 1 hora - datos estables
};
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de conexión a PostgreSQL

```bash
# Verificar que el contenedor esté ejecutándose
docker-compose ps

# Revisar logs de PostgreSQL
docker-compose logs postgres

# Verificar conectividad
docker-compose exec app ping postgres
```

#### 2. Error de conexión a Redis

```bash
# Verificar estado de Redis
docker-compose exec redis redis-cli ping

# Limpiar cache si es necesario
docker-compose exec redis redis-cli FLUSHALL
```

#### 3. Error de permisos

```bash
# Dar permisos a directorios de volumen
sudo chown -R $USER:$USER docker/

# Reconstruir contenedores
docker-compose down -v
docker-compose up --build -d
```

#### 4. Cache inconsistente

```bash
# Limpiar cache Redis
docker-compose exec redis redis-cli FLUSHALL

# Reiniciar aplicación
docker-compose restart app
```

## 📝 Ejemplos de Uso

### Crear una película

```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Matrix",
    "description": "A hacker discovers reality is a simulation",
    "releaseYear": 1999,
    "duration": 136,
    "rating": 8.7,
    "synopsis": "Neo, a hacker, discovers the world is a computer simulation...",
    "genreId": 1,
    "directorId": 1
  }'
```

### Buscar películas con cache

```bash
# Primera consulta - accede a base de datos
curl "http://localhost:3000/movies?genre=action&page=1&limit=5"

# Segunda consulta - servida desde cache (mucho más rápida)
curl "http://localhost:3000/movies?genre=action&page=1&limit=5"
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License.

## 🙋‍♂️ Soporte

Para reportar bugs o solicitar nuevas características, por favor crear un issue en el repositorio.

---

**Desarrollado con ❤️ usando NestJS, PostgreSQL y Redis**
