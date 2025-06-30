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
import { DirectorsService } from './directors.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('directors')
@Controller('directors')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new director' })
  @ApiResponse({
    status: 201,
    description: 'The director has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createDirectorDto: CreateDirectorDto) {
    return this.directorsService.create(createDirectorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all directors with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Return all directors with pagination.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by first name or last name' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.directorsService.findAll(paginationDto, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a director by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return the director.',
  })
  @ApiResponse({ status: 404, description: 'Director not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.directorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a director' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The director has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Director not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ) {
    return this.directorsService.update(id, updateDirectorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a director' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'The director has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Director not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.directorsService.remove(id);
  }
} 