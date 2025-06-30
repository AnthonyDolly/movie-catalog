import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Genre name',
    example: 'Action',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Genre description',
    example: 'Movies with intense action sequences and adventures',
  })
  @IsString()
  @IsOptional()
  description?: string;
} 