import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CacheService } from '../common/services/cache.service';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly cacheService: CacheService,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const genre = this.genreRepository.create(createGenreDto);
    const savedGenre = await this.genreRepository.save(genre);

    // Clear cache after creating new genre
    await this.cacheService.clearGenreCache();

    return savedGenre;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: Genre[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;

    // Generate cache key based on pagination
    const cacheParams = { page, limit };

    // Try to get from cache first
    const cachedResult = await this.cacheService.getGenres(cacheParams);
    if (cachedResult) {
      return cachedResult;
    }

    // If not in cache, fetch from database
    const skip = (page - 1) * limit;

    const [data, total] = await this.genreRepository.findAndCount({
      take: limit,
      skip,
      order: { name: 'ASC' },
    });

    const result = {
      data,
      total,
      page,
      limit,
    };

    // Cache the result
    await this.cacheService.setGenres(result, cacheParams);

    return result;
  }

  async findOne(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);
    Object.assign(genre, updateGenreDto);

    const updatedGenre = await this.genreRepository.save(genre);

    // Clear cache after updating
    await this.cacheService.clearGenreCache();

    return updatedGenre;
  }

  async remove(id: number): Promise<void> {
    const genre = await this.findOne(id);
    await this.genreRepository.remove(genre);

    // Clear cache after deleting
    await this.cacheService.clearGenreCache();
  }

  async findByName(name: string): Promise<Genre | null> {
    return await this.genreRepository.findOne({
      where: { name },
    });
  }
}
