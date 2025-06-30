import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Director } from './entities/director.entity';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  async create(createDirectorDto: CreateDirectorDto): Promise<Director> {
    const director = this.directorRepository.create(createDirectorDto);
    return await this.directorRepository.save(director);
  }

  async findAll(paginationDto: PaginationDto, search?: string): Promise<{ data: Director[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.directorRepository.findAndCount({
      where: whereCondition,
      take: limit,
      skip,
      order: { lastName: 'ASC', firstName: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Director> {
    const director = await this.directorRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!director) {
      throw new NotFoundException(`Director with ID ${id} not found`);
    }

    return director;
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto): Promise<Director> {
    const director = await this.findOne(id);
    Object.assign(director, updateDirectorDto);
    return await this.directorRepository.save(director);
  }

  async remove(id: number): Promise<void> {
    const director = await this.findOne(id);
    await this.directorRepository.remove(director);
  }

  async findByName(firstName: string, lastName: string): Promise<Director | null> {
    return await this.directorRepository.findOne({
      where: { firstName, lastName },
    });
  }
} 