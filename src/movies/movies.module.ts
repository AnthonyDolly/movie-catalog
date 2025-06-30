import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { GenresModule } from '../genres/genres.module';
import { DirectorsModule } from '../directors/directors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    GenresModule,
    DirectorsModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {} 