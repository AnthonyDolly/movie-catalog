FROM node:lts-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl dumb-init

# Create non-root user for security ANTES de instalar dependencias
RUN addgroup -g 1001 -S nestjs && \
    adduser -S nestjs -u 1001

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install ALL dependencies for development
RUN npm ci --silent && \
    npm cache clean --force

# Copy source code
COPY --chown=nestjs:nestjs . .

# Asegurar que el usuario nestjs tenga permisos en toda la carpeta /app
RUN chown -R nestjs:nestjs /app

# Crear carpeta dist con permisos correctos
RUN mkdir -p /app/dist && chown -R nestjs:nestjs /app/dist

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check (ajustado para NestJS)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["npm", "run", "start:dev"]