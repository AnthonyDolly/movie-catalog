import { IsString, IsNotEmpty, IsOptional, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDirectorDto {
  @ApiProperty({
    description: 'Director first name',
    example: 'Christopher',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Director last name',
    example: 'Nolan',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Director birth date',
    example: '1970-07-30',
    type: 'string',
    format: 'date',
  })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'Director nationality',
    example: 'British',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nationality?: string;

  @ApiPropertyOptional({
    description: 'Director biography',
    example: 'Christopher Nolan is a British-American film director, producer, and screenwriter.',
  })
  @IsString()
  @IsOptional()
  biography?: string;
} 