# Docker Containers Architecture Diagram

Este diagrama muestra la arquitectura de contenedores Docker para el proyecto Movie Catalog, incluyendo las diferencias entre los entornos de desarrollo y producción.

## Diagrama de Contenedores

```mermaid
graph TB
    subgraph "Docker Network: movie-catalog-dev/prod"
        subgraph "App Container"
            APP[NestJS Application<br/>Port: 3000<br/>Dev Health: /api/v1/health<br/>Prod Health: /health<br/>User: nestjs]
            APP_ENV[Environment Variables:<br/>DB_HOST: postgres<br/>DB_PORT: 5432<br/>DB_USER: postgres<br/>DB_PASSWORD: ***<br/>REDIS_HOST: redis<br/>REDIS_PORT: 6379<br/>NODE_ENV: dev or production]
            APP_VOL[Development: Local uploads<br/>Hot reload volumes<br/>Production: AWS S3]
        end
        
        subgraph "Database Container"
            PG[PostgreSQL 15-alpine<br/>External Port: 5433 dev, variable prod<br/>Internal Port: 5432<br/>Database: movie_catalog_dev or variable]
            PG_VOL[(postgres_dev_data or<br/>postgres_prod_data<br/>Volume)]
            PG_HEALTH[Health Check:<br/>pg_isready -U postgres<br/>-d database_name<br/>interval: 10s or 30s]
        end
        
        subgraph "Cache Container"
            REDIS[Redis 7-alpine<br/>External Port: 6379 dev, variable prod<br/>Internal Port: 6379<br/>--appendonly yes<br/>Prod: --requirepass]
            REDIS_VOL[(redis_dev_data or<br/>redis_prod_data<br/>Volume)]
            REDIS_HEALTH[Health Check:<br/>Dev: redis-cli ping<br/>Prod: redis-cli -a password ping<br/>interval: 10s or 30s]
        end
    end
    
    subgraph "External Services"
        S3[AWS S3 Bucket<br/>Production Only<br/>Movie Poster Storage<br/>Environment Variables:<br/>AWS_REGION<br/>AWS_ACCESS_KEY_ID<br/>AWS_SECRET_ACCESS_KEY<br/>AWS_S3_BUCKET]
        CLIENT[Frontend Client<br/>CORS_ORIGIN<br/>External Access]
    end
    
    subgraph "Development vs Production"
        DEV[Development Environment:<br/>- docker-compose.yml<br/>- Dockerfile<br/>- Local file uploads<br/>- Hot reload volumes<br/>- LOG_LEVEL: debug<br/>- CORS_ORIGIN: *]
        PROD[Production Environment:<br/>- docker-compose.prod.yml<br/>- Dockerfile.prod<br/>- Multi-stage build<br/>- AWS S3 storage<br/>- Memory limits: 256M-512M<br/>- LOG_LEVEL: error<br/>- Redis password protected<br/>- restart: unless-stopped]
    end
    
    subgraph "Dependencies & Health"
        APP_HEALTH[App Container Dependencies:<br/>depends_on:<br/>- postgres: service_healthy<br/>- redis: service_healthy<br/>Healthcheck intervals:<br/>Dev: 30s, 10s, 40s start<br/>Prod: 30s, 10s]
        INIT_SQL[Database Initialization:<br/>docker init.sql<br/>Automatic seeding when empty]
        BACKUPS[Production Backups:<br/>docker backups volume<br/>PostgreSQL backup storage]
    end
    
    %% Connections
    CLIENT --> APP
    APP --> PG
    APP --> REDIS
    APP -.-> S3
    PG --> PG_VOL
    REDIS --> REDIS_VOL
    APP --> APP_VOL
    PG -.-> INIT_SQL
    PG -.-> BACKUPS
    
    %% Styling
    classDef container fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef volume fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef environment fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef health fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class APP,PG,REDIS container
    class PG_VOL,REDIS_VOL,APP_VOL volume
    class S3,CLIENT external
    class DEV,PROD,APP_ENV environment
    class APP_HEALTH,INIT_SQL,BACKUPS health
```

## Descripción de Componentes

### Contenedores Principales

#### 🔵 App Container (NestJS)
- **Imagen**: Node.js LTS Alpine
- **Puerto**: 3000
- **Usuario**: nestjs (seguridad)
- **Healthcheck**: 
  - Desarrollo: `/api/v1/health` (30s interval, 10s timeout, 40s start period)
  - Producción: `/health` (30s interval, 10s timeout)
- **Configuración**:
  - Desarrollo: Hot reload con volúmenes montados
  - Producción: Multi-stage build, límites de memoria (256M-512M)

#### 🔵 Database Container (PostgreSQL)
- **Imagen**: postgres:15-alpine
- **Puerto**: 
  - Desarrollo: 5433:5432
  - Producción: variable:5432
- **Base de datos**: 
  - Desarrollo: `movie_catalog_dev`
  - Producción: variable
- **Healthcheck**: `pg_isready -U postgres -d database_name`
- **Características**:
  - Inicialización automática con `docker/init.sql`
  - Backups en producción (`docker/backups`)

#### 🔵 Cache Container (Redis)
- **Imagen**: redis:7-alpine
- **Puerto**: 6379
- **Configuración**:
  - AOF (Append Only File) habilitado
  - Desarrollo: Sin autenticación
  - Producción: Protegido con password
- **Healthcheck**: 
  - Desarrollo: `redis-cli ping`
  - Producción: `redis-cli -a password ping`

### 🟣 Volúmenes Persistentes

- **postgres_dev_data / postgres_prod_data**: Datos de PostgreSQL
- **redis_dev_data / redis_prod_data**: Datos de Redis
- **app_node_modules**: Node modules (solo desarrollo)

### 🟠 Servicios Externos

#### AWS S3 (Solo Producción)
- Almacenamiento de imágenes de pósters
- Variables de entorno: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`

#### Frontend Client
- Acceso externo a la API
- Configuración de CORS según entorno

### 🟢 Variables de Entorno

#### Desarrollo
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=dev_password_123
DB_NAME=movie_catalog_dev
REDIS_HOST=redis
REDIS_PORT=6379
NODE_ENV=development
CORS_ORIGIN=*
LOG_LEVEL=debug
```

#### Producción
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}
NODE_ENV=production
CORS_ORIGIN=${CORS_ORIGIN}
LOG_LEVEL=error
AWS_REGION=${AWS_REGION}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_S3_BUCKET=${AWS_S3_BUCKET}
```

### 🔴 Dependencias y Salud

#### App Dependencies
- **depends_on**: 
  - `postgres`: `service_healthy`
  - `redis`: `service_healthy`
- El contenedor de la aplicación no se inicia hasta que PostgreSQL y Redis estén completamente saludables

#### Health Checks
- **PostgreSQL**: Verifica conexión cada 10s (dev) o 30s (prod)
- **Redis**: Verifica conectividad cada 10s (dev) o 30s (prod)
- **App**: Verifica endpoint de salud cada 30s

## Diferencias Clave: Desarrollo vs Producción

| Aspecto | Desarrollo | Producción |
|---------|------------|------------|
| **Dockerfile** | `Dockerfile` | `Dockerfile.prod` |
| **Compose** | `docker-compose.yml` | `docker-compose.prod.yml` |
| **Build** | Single-stage, todas las dependencias | Multi-stage, solo producción |
| **Storage** | Local (`uploads/`) | AWS S3 |
| **Redis** | Sin password | Con password |
| **Logs** | `debug` | `error` |
| **CORS** | `*` (todos los orígenes) | Específico |
| **Restart** | `always` | `unless-stopped` |
| **Memory** | Sin límites | 256M-512M |
| **Hot Reload** | ✅ Volúmenes montados | ❌ Build estático |
| **Backups** | ❌ | ✅ Volumen de backups |

## Comandos de Uso

### Desarrollo
```bash
# Iniciar todos los servicios
make dev

# Ver logs
make logs

# Parar servicios
make down
```

### Producción
```bash
# Iniciar servicios de producción
make prod

# Ver logs de producción
make logs-prod

# Parar servicios de producción
make down-prod
```

---

*Este diagrama refleja la configuración actual de Docker basada en `docker-compose.yml` y `docker-compose.prod.yml`* 