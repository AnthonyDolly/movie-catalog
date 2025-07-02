import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Genre } from './entities/genre.entity';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({ status: 201, description: 'Genre created successfully', type: Genre })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres with pagination' })
  @ApiResponse({ status: 200, description: 'Genres retrieved successfully', type: [Genre] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.genresService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by ID' })
  @ApiResponse({ status: 200, description: 'Genre retrieved successfully', type: Genre })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a genre' })
  @ApiResponse({ status: 200, description: 'Genre updated successfully', type: Genre })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a genre' })
  @ApiResponse({ status: 200, description: 'Genre deleted successfully' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}
