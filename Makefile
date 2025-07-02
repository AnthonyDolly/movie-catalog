# Makefile para Movie Catalog API
.PHONY: help dev dev-down prod prod-down logs-dev logs-prod restart-dev restart-prod status clean build-dev build-prod

# Variables
DEV_COMPOSE_FILE = docker-compose.yml
PROD_COMPOSE_FILE = docker-compose.prod.yml
DEV_ENV_FILE = .env
PROD_ENV_FILE = .env.prod

# Comando por defecto
help:
	@echo "🎬 Movie Catalog API - Comandos disponibles:"
	@echo ""
	@echo "📦 Desarrollo:"
	@echo "  dev           - Levantar entorno de desarrollo"
	@echo "  dev-down      - Bajar entorno de desarrollo"
	@echo "  restart-dev   - Reiniciar entorno de desarrollo"
	@echo "  build-dev     - Construir imagen de desarrollo"
	@echo "  logs-dev      - Ver logs de desarrollo en tiempo real"
	@echo ""
	@echo "🚀 Producción:"
	@echo "  prod          - Levantar entorno de producción"
	@echo "  prod-down     - Bajar entorno de producción"
	@echo "  restart-prod  - Reiniciar entorno de producción"
	@echo "  build-prod    - Construir imagen de producción"
	@echo "  logs-prod     - Ver logs de producción en tiempo real"
	@echo ""
	@echo "🔧 Utilidades:"
	@echo "  status        - Ver estado de contenedores"
	@echo "  clean         - Limpiar contenedores, imágenes y volúmenes"
	@echo ""

# Desarrollo
dev:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) up --build

dev-down:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) down

restart-dev:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) restart

build-dev:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) build

logs-dev:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) logs -f

# Producción
prod:
	docker compose --env-file $(PROD_ENV_FILE) -f $(PROD_COMPOSE_FILE) up --build -d

prod-down:
	docker compose --env-file $(PROD_ENV_FILE) -f $(PROD_COMPOSE_FILE) down

restart-prod:
	docker compose --env-file $(PROD_ENV_FILE) -f $(PROD_COMPOSE_FILE) restart

build-prod:
	docker compose --env-file $(PROD_ENV_FILE) -f $(PROD_COMPOSE_FILE) build

logs-prod:
	docker compose --env-file $(PROD_ENV_FILE) -f $(PROD_COMPOSE_FILE) logs -f

# Utilidades
status:
	@echo "📊 Estado de contenedores:"
	docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

clean:
	@echo "🧹 Limpiando contenedores, imágenes y volúmenes..."
	docker compose down --volumes --remove-orphans
	docker system prune -f
	@echo "✅ Limpieza completada"