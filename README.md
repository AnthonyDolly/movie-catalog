# Movie Catalog API 🎬

A comprehensive REST API for managing movies, genres, and directors built with NestJS, TypeORM, and PostgreSQL.

## 📌 Overview

This API allows you to manage a movie catalog with support for:
- CRUD operations for Movies, Genres, and Directors
- Advanced search and filtering
- Pagination and sorting
- Robust validation with DTOs
- Swagger API documentation
- Centralized error handling
- Request logging middleware

## 🚀 Features

- **Movies Management**: Create, read, update, and delete movies with genre and director relationships
- **Genres Management**: Organize movies by categories
- **Directors Management**: Manage director information and filmography
- **Advanced Filtering**: Search by title, filter by genre/director/year
- **Pagination**: Efficient data loading with configurable page sizes
- **Sorting**: Sort by title, release year, rating, or creation date
- **Data Validation**: Comprehensive DTOs with validation decorators
- **API Documentation**: Auto-generated Swagger documentation
- **Database Relations**: Proper foreign key relationships between entities
- **Error Handling**: Global exception filter with detailed error responses
- **Logging**: HTTP request logging middleware

## 🛠️ Tech Stack

- **Framework**: NestJS with Express
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Runtime**: Node.js 18+

## 📋 API Endpoints

### Movies
- `GET /movies` - Get all movies with pagination and filters
- `GET /movies/:id` - Get movie by ID
- `POST /movies` - Create new movie
- `PATCH /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie
- `GET /movies/genre/:genreId` - Get movies by genre
- `GET /movies/director/:directorId` - Get movies by director

### Genres
- `GET /genres` - Get all genres with pagination
- `GET /genres/:id` - Get genre by ID
- `POST /genres` - Create new genre
- `PATCH /genres/:id` - Update genre
- `DELETE /genres/:id` - Delete genre

### Directors
- `GET /directors` - Get all directors with pagination and search
- `GET /directors/:id` - Get director by ID
- `POST /directors` - Create new director
- `PATCH /directors/:id` - Update director
- `DELETE /directors/:id` - Delete director

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd movie-catalog
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=movie_catalog

# Application
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=*
```

4. **Start PostgreSQL database**
Using Docker Compose:
```bash
docker-compose up postgres -d
```

Or install PostgreSQL locally and create the database.

## 🚀 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## 📚 API Documentation

Once the application is running, you can access:
- **Swagger UI**: http://localhost:3000/api/docs
- **API Endpoints**: http://localhost:3000

## 🔍 Query Parameters

### Movies Endpoint
```
GET /movies?page=1&limit=10&search=Matrix&genre=Action&director=Nolan&year=2010&sortBy=releaseYear&order=DESC
```

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by movie title
- `genre` (optional): Filter by genre name
- `director` (optional): Filter by director name
- `year` (optional): Filter by release year
- `sortBy` (optional): Sort field (title, releaseYear, rating, createdAt)
- `order` (optional): Sort order (ASC, DESC)

## 📊 Database Schema

### Movies Table
```sql
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  releaseYear INTEGER NOT NULL,
  duration INTEGER,
  rating DECIMAL(3,1),
  posterUrl VARCHAR(500),
  synopsis TEXT,
  genreId INTEGER REFERENCES genres(id),
  directorId INTEGER REFERENCES directors(id),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Genres Table
```sql
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Directors Table
```sql
CREATE TABLE directors (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  birthDate DATE,
  nationality VARCHAR(100),
  biography TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐳 Docker Development

Start the full application stack with Docker Compose:

```bash
# Start PostgreSQL and the application
docker-compose up

# Start only PostgreSQL
docker-compose up postgres -d
```

## 📝 Example Usage

### Create a Genre
```bash
curl -X POST http://localhost:3000/genres \
  -H "Content-Type: application/json" \
  -d '{"name": "Action", "description": "High-energy movies"}'
```

### Create a Director
```bash
curl -X POST http://localhost:3000/directors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Christopher",
    "lastName": "Nolan",
    "birthDate": "1970-07-30",
    "nationality": "British"
  }'
```

### Create a Movie
```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "description": "A mind-bending thriller",
    "releaseYear": 2010,
    "duration": 148,
    "rating": 8.8,
    "genreId": 1,
    "directorId": 1
  }'
```

### Search Movies
```bash
curl "http://localhost:3000/movies?search=Inception&genre=Action&sortBy=rating&order=DESC"
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | password |
| `DB_NAME` | Database name | movie_catalog |
| `PORT` | Application port | 3000 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | CORS origin | * |

## 🎯 Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── dto/               # Common DTOs
│   ├── filters/           # Exception filters
│   └── middleware/        # Custom middleware
├── database/              # Database configuration
├── directors/             # Directors module
│   ├── dto/               # Director DTOs
│   ├── entities/          # Director entity
│   ├── directors.controller.ts
│   ├── directors.service.ts
│   └── directors.module.ts
├── genres/                # Genres module
│   ├── dto/               # Genre DTOs
│   ├── entities/          # Genre entity
│   ├── genres.controller.ts
│   ├── genres.service.ts
│   └── genres.module.ts
├── movies/                # Movies module
│   ├── dto/               # Movie DTOs
│   ├── entities/          # Movie entity
│   ├── movies.controller.ts
│   ├── movies.service.ts
│   └── movies.module.ts
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is [MIT licensed](LICENSE).
