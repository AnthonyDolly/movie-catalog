import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Genre } from '../genres/entities/genre.entity';
import { Director } from '../directors/entities/director.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Genre, Director, Movie])],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {} 