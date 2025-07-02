import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Genre } from './entities/genre.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Genre]), CommonModule],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService, TypeOrmModule],
})
export class GenresModule {}
