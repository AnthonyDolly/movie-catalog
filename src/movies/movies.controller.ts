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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieFilterDto, PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

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