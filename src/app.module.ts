import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { DirectorsModule } from './directors/directors.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { databaseConfig } from './database/database.config';
import { SeedService } from './database/seed.service';
import { Genre } from './genres/entities/genre.entity';
import { Director } from './directors/entities/director.entity';
import { Movie } from './movies/entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Genre, Director, Movie]),
    MoviesModule,
    GenresModule,
    DirectorsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, SeedService],
  exports: [SeedService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
