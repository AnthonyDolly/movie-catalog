import { IsOptional, IsPositive, IsInt, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number = 10;
}

export class MovieFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search term for movie title',
    example: 'Matrix',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by genre name',
    example: 'Action',
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Filter by director name',
    example: 'Nolan',
  })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiPropertyOptional({
    description: 'Filter by release year',
    example: 2010,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'releaseYear',
    enum: ['title', 'releaseYear', 'rating', 'createdAt'],
  })
  @IsString()
  @IsIn(['title', 'releaseYear', 'rating', 'createdAt'])
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'DESC';
} 