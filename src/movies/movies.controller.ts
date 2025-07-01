import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieFilterDto, PaginationDto } from '../common/dto/pagination.dto';
import { UploadService } from '../common/services/upload.service';
import { FileValidationInterceptor } from '../common/interceptors/file-validation.interceptor';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Post(':id/poster')
  @UseInterceptors(FileInterceptor('poster'), FileValidationInterceptor)
  @ApiOperation({ summary: 'Upload poster image for a movie' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: 'number', description: 'Movie ID' })
  @ApiResponse({
    status: 200,
    description: 'Poster uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        posterUrl: { type: 'string', description: 'URL of the uploaded poster' },
        message: { type: 'string', description: 'Success message' },
        fileName: { type: 'string', description: 'Generated file name' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file format, size, or movie not found' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async uploadPoster(
    @Param('id', ParseIntPipe) movieId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Verify movie exists
    const movie = await this.moviesService.findOne(movieId);
    
    // Delete old poster if exists
    if (movie.posterUrl) {
      await this.uploadService.deletePoster(movie.posterUrl);
    }

    // Upload new poster
    const posterUrl = await this.uploadService.uploadPoster(file);

    // Update movie with new poster URL
    await this.moviesService.update(movieId, { posterUrl });

    return { 
      posterUrl,
      message: 'Poster uploaded successfully',
      fileName: posterUrl.split('/').pop(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies with pagination, search and filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all movies with pagination and filters applied.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by movie title' })
  @ApiQuery({ name: 'genre', required: false, type: String, description: 'Filter by genre name' })
  @ApiQuery({ name: 'director', required: false, type: String, description: 'Filter by director name' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Filter by release year' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['title', 'releaseYear', 'rating', 'createdAt'] })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  findAll(@Query() filterDto: MovieFilterDto) {
    return this.moviesService.findAll(filterDto);
  }

  @Get('genre/:genreId')
  @ApiOperation({ summary: 'Get movies by genre' })
  @ApiParam({ name: 'genreId', type: 'number' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return movies filtered by genre.',
  })
  findByGenre(
    @Param('genreId', ParseIntPipe) genreId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.moviesService.findByGenre(genreId, paginationDto);
  }

  @Get('director/:directorId')
  @ApiOperation({ summary: 'Get movies by director' })
  @ApiParam({ name: 'directorId', type: 'number' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return movies filtered by director.',
  })
  findByDirector(
    @Param('directorId', ParseIntPipe) directorId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.moviesService.findByDirector(directorId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return the movie.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id/poster')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete poster image from a movie' })
  @ApiParam({ name: 'id', type: 'number', description: 'Movie ID' })
  @ApiResponse({
    status: 204,
    description: 'Poster deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async deletePoster(@Param('id', ParseIntPipe) movieId: number) {
    // Verify movie exists and get current poster
    const movie = await this.moviesService.findOne(movieId);
    
    if (movie.posterUrl) {
      // Delete poster file
      await this.uploadService.deletePoster(movie.posterUrl);
      
      // Update movie to remove poster URL
      await this.moviesService.update(movieId, { posterUrl: undefined });
    }
    
    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'The movie has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
} 