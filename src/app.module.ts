import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { DirectorsModule } from './directors/directors.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { databaseConfig } from './database/database.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    CommonModule,
    DatabaseModule,
    MoviesModule,
    GenresModule,
    DirectorsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*splat');

  }
}
