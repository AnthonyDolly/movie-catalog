import { IsString, IsNotEmpty, IsOptional, MaxLength, IsInt, IsNumber, Min, Max, IsPositive, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Movie title',
    example: 'Inception',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Movie description',
    example: 'A thief who steals corporate secrets through dream-sharing technology.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Movie release year',
    example: 2010,
    minimum: 1888,
    maximum: 2030,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1888)
  @Max(2030)
  releaseYear: number;

  @ApiPropertyOptional({
    description: 'Movie duration in minutes',
    example: 148,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({
    description: 'Movie rating from 0.0 to 10.0',
    example: 8.8,
    minimum: 0,
    maximum: 10,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(10)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({
    description: 'Movie poster URL',
    example: 'https://example.com/inception-poster.jpg',
  })
  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @ApiPropertyOptional({
    description: 'Movie synopsis',
    example: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction...',
  })
  @IsString()
  @IsOptional()
  synopsis?: string;

  @ApiProperty({
    description: 'Genre ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  genreId: number;

  @ApiProperty({
    description: 'Director ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  directorId: number;
} 