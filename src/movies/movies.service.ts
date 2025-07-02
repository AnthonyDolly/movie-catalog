import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, MoreThanOrEqual } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { Director } from '../directors/entities/director.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieFilterDto } from '../common/dto/pagination.dto';
import { CacheService } from '../common/services/cache.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    private readonly cacheService: CacheService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genreId, directorId, ...movieData } = createMovieDto;

    // Verify genre exists
    const genre = await this.genreRepository.findOne({
      where: { id: genreId },
    });
    if (!genre) {
      throw new BadRequestException(`Genre with ID ${genreId} not found`);
    }

    // Verify director exists
    const director = await this.directorRepository.findOne({
      where: { id: directorId },
    });
    if (!director) {
      throw new BadRequestException(`Director with ID ${directorId} not found`);
    }

    const movie = this.movieRepository.create({
      ...movieData,
      genre,
      director,
    });

    const savedMovie = await this.movieRepository.save(movie);

    // Clear movie cache after creating new movie
    await this.cacheService.clearMovieCache();

    return savedMovie;
  }

  async findAll(
    filterDto: MovieFilterDto,
  ): Promise<{ data: Movie[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      genre,
      director,
      year,
      sortBy = 'createdAt',
      order = 'DESC',
    } = filterDto;

    // Generate cache key based on filters
    const cacheParams = {
      page,
      limit,
      search: search || '',
      genre: genre || '',
      director: director || '',
      year: year || '',
      sortBy,
      order,
    };

    // Try to get from cache first
    if (search || genre || director || year) {
      // For search and filtered results, use search cache
      const cachedResult = await this.cacheService.getSearchMovies(cacheParams);
      if (cachedResult) {
        return cachedResult;
      }
    } else {
      // For general listing, use movies cache
      const cachedResult = await this.cacheService.getMovies(cacheParams);
      if (cachedResult) {
        return cachedResult;
      }
    }

    // If not in cache, fetch from database
    const skip = (page - 1) * limit;

    const queryBuilder: SelectQueryBuilder<Movie> = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genre', 'genre')
      .leftJoinAndSelect('movie.director', 'director');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere('movie.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Apply genre filter
    if (genre) {
      queryBuilder.andWhere('genre.name ILIKE :genre', { genre: `%${genre}%` });
    }

    // Apply director filter
    if (director) {
      queryBuilder.andWhere(
        '(director.firstName ILIKE :director OR director.lastName ILIKE :director)',
        { director: `%${director}%` },
      );
    }

    // Apply year filter
    if (year) {
      queryBuilder.andWhere('movie.releaseYear = :year', { year });
    }

    // Apply sorting
    const orderDirection = order.toUpperCase() as 'ASC' | 'DESC';
    if (sortBy === 'title') {
      queryBuilder.orderBy('movie.title', orderDirection);
    } else if (sortBy === 'releaseYear') {
      queryBuilder.orderBy('movie.releaseYear', orderDirection);
    } else if (sortBy === 'rating') {
      queryBuilder.orderBy('movie.rating', orderDirection);
    } else {
      queryBuilder.orderBy('movie.createdAt', orderDirection);
    }

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const result = {
      data,
      total,
      page,
      limit,
    };

    // Cache the result
    if (search || genre || director || year) {
      await this.cacheService.setSearchMovies(result, cacheParams);
    } else {
      await this.cacheService.setMovies(result, cacheParams);
    }

    return result;
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['genre', 'director'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const { genreId, directorId, ...movieData } = updateMovieDto as any;
    const movie = await this.findOne(id);

    // Update genre if provided
    if (genreId !== undefined) {
      const genre = await this.genreRepository.findOne({
        where: { id: genreId },
      });
      if (!genre) {
        throw new BadRequestException(`Genre with ID ${genreId} not found`);
      }
      movie.genre = genre;
    }

    // Update director if provided
    if (directorId !== undefined) {
      const director = await this.directorRepository.findOne({
        where: { id: directorId },
      });
      if (!director) {
        throw new BadRequestException(
          `Director with ID ${directorId} not found`,
        );
      }
      movie.director = director;
    }

    // Update other fields
    Object.assign(movie, movieData);

    const updatedMovie = await this.movieRepository.save(movie);

    // Clear movie cache after updating
    await this.cacheService.clearMovieCache();

    return updatedMovie;
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);

    // Clear movie cache after deleting
    await this.cacheService.clearMovieCache();
  }

  async findByGenre(
    genreId: number,
    paginationDto: { page?: number; limit?: number },
  ): Promise<{ data: Movie[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;

    const cacheParams = { page, limit };

    // Try to get from cache first
    const cachedResult = await this.cacheService.getMoviesByGenre(
      genreId,
      cacheParams,
    );
    if (cachedResult) {
      return cachedResult;
    }

    // If not in cache, fetch from database
    const skip = (page - 1) * limit;

    const [data, total] = await this.movieRepository.findAndCount({
      where: { genre: { id: genreId } },
      relations: ['genre', 'director'],
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    });

    const result = {
      data,
      total,
      page,
      limit,
    };

    // Cache the result
    await this.cacheService.setMoviesByGenre(genreId, result, cacheParams);

    return result;
  }

  async findByDirector(
    directorId: number,
    paginationDto: { page?: number; limit?: number },
  ): Promise<{ data: Movie[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;

    const cacheParams = { page, limit };

    // Try to get from cache first
    const cachedResult = await this.cacheService.getMoviesByDirector(
      directorId,
      cacheParams,
    );
    if (cachedResult) {
      return cachedResult;
    }

    // If not in cache, fetch from database
    const skip = (page - 1) * limit;

    const [data, total] = await this.movieRepository.findAndCount({
      where: { director: { id: directorId } },
      relations: ['genre', 'director'],
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    });

    const result = {
      data,
      total,
      page,
      limit,
    };

    // Cache the result
    await this.cacheService.setMoviesByDirector(
      directorId,
      result,
      cacheParams,
    );

    return result;
  }

  /**
   * Get popular movies (highest rated)
   */
  async findPopular(paginationDto: {
    page?: number;
    limit?: number;
  }): Promise<{ data: Movie[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;

    const cacheParams = { page, limit };

    // Try to get from cache first
    const cachedResult = await this.cacheService.getPopularMovies(cacheParams);
    if (cachedResult) {
      return cachedResult;
    }

    // If not in cache, fetch from database
    const skip = (page - 1) * limit;

    const [data, total] = await this.movieRepository.findAndCount({
      relations: ['genre', 'director'],
      take: limit,
      skip,
      order: { rating: 'DESC', createdAt: 'DESC' },
      where: {
        rating: MoreThanOrEqual(5.0), // Include all movies with rating (excluding null)
      },
    });

    const result = {
      data,
      total,
      page,
      limit,
    };

    // Cache the result for longer since popularity doesn't change often
    await this.cacheService.setPopularMovies(result, cacheParams);

    return result;
  }
}
