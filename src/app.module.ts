import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { DirectorsModule } from './directors/directors.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { databaseConfig } from './database/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    MoviesModule,
    GenresModule,
    DirectorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
