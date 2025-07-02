import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorsService } from './directors.service';
import { DirectorsController } from './directors.controller';
import { Director } from './entities/director.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Director]), CommonModule],
  controllers: [DirectorsController],
  providers: [DirectorsService],
  exports: [DirectorsService, TypeOrmModule],
})
export class DirectorsModule {}
