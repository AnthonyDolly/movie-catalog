📌 Overview
Esta API permite gestionar un catálogo de películas, sus géneros y directores asociados. Está pensada como un backend profesional con buenas prácticas de desarrollo, incluyendo documentación Swagger, validaciones robustas, relaciones entre entidades y paginación.
Usuarios objetivo: desarrolladores frontend, aplicaciones móviles o sistemas de gestión de contenido para cine.

⚙️ Core Features
- CRUD de Películas
- CRUD de Géneros
- CRUD de Directores
- Relación entre entidades (películas tienen género y director)
- Búsqueda y filtros: por nombre, año, género o director
- Paginación y ordenamiento
- Validación de datos con DTOs
- Documentación automática con Swagger
- Manejo de errores centralizado
- Middleware de logs

🌐 User Experience (API Consumers)
Rutas principales (REST):
Recurso	    Método	            Ruta	        Descripción
movies	    GET	                /movies	        Listar películas (paginadas)
movies	    GET	                /movies/:id	    Obtener detalles de una película
movies	    POST	            /movies	        Crear película (validación de datos)
movies	    PUT	                /movies/:id	    Editar película (validación de datos)
movies	    DELETE	            /movies/:id	    Eliminar película
genres	    GET/POST/...	    /genres/...	    CRUD de géneros (validación de datos)
directors	GET/POST/...	    /directors/...	CRUD de directores (validación de datos)

Parámetros de consulta comunes:
?page=1&limit=10

?search=Matrix

?genre=Drama&director=Nolan

?sortBy=releaseYear&order=DESC

🧱 Technical Architecture
- Framework: NestJS con Express
- Base de datos: PostgreSQL
- ORM: TypeORM
- Cache (opcional): Redis para listas frecuentes
- Logs: middleware propio (winston o pino)
- Documentación: Swagger con NestJS @nestjs/swagger
- Testing: Jest + Supertest (mínimo unit + integration)

🚧 Development Roadmap
- Semana	Tarea
- 1	Configuración del proyecto + Docker (opcional)
- 2	CRUD de Géneros
- 3	CRUD de Directores
- 4	CRUD de Películas con relaciones
- 5	Búsqueda, paginación, ordenamiento
- 6	Documentación Swagger + validaciones
- 7	Tests unitarios e integración
- 8	Deploy en Render o Railway (opcional)

🔗 Logical Dependency Chain
- Base de datos + TypeORM configurado
- CRUD de entidades simples (Géneros, Directores)
- Películas (requieren FK a los anteriores)
- Filtros y búsquedas
- Documentación, pruebas, optimización

⚠️ Risks and Mitigations
- Riesgo	Mitigación
- Relaciones incorrectas	Pruebas de integración + validaciones FK
- Filtros lentos	Indexar columnas title, releaseYear
- Validaciones mal implementadas	DTOs estrictos con class-validator
- Payloads incorrectos	Swagger + ejemplos en Postman

📎 Appendix
- Entidades modelo (con relaciones)
- Diagrama de base de datos (puedo generarlo si deseas)
- Especificación Swagger JSON (al final del proyecto)
- Script SQL para poblar datos de ejemplo