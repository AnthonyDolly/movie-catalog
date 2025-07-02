import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Genre } from '../../genres/entities/genre.entity';
import { Director } from '../../directors/entities/director.entity';

@Entity('movies')
export class Movie {
  @ApiProperty({ description: 'Unique identifier for the movie', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Title of the movie', example: 'The Matrix', maxLength: 200 })
  @Column({ length: 200 })
  @Index() // Index for search performance
  title: string;

  @ApiProperty({ description: 'Brief description of the movie', example: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Year when the movie was released', example: 1999 })
  @Column({ type: 'int' })
  @Index() // Index for filtering by year
  releaseYear: number;

  @ApiProperty({ description: 'Duration of the movie in minutes', example: 136, required: false })
  @Column({ type: 'int', nullable: true })
  duration: number; // Duration in minutes

  @ApiProperty({ description: 'Movie rating from 0.0 to 10.0', example: 8.7, required: false })
  @Column({ type: 'float', nullable: true })
  rating: number; // Rating from 0.0 to 10.0

  @ApiProperty({ description: 'URL of the movie poster image', example: '/uploads/posters/poster-123.jpg', required: false })
  @Column({ length: 500, nullable: true })
  posterUrl: string;

  @ApiProperty({ description: 'Detailed synopsis of the movie', example: 'Neo (Keanu Reeves) believes that Morpheus (Laurence Fishburne), an elusive figure considered to be the most dangerous man alive, can answer his question -- What is the Matrix?', required: false })
  @Column({ type: 'text', nullable: true })
  synopsis: string;

  @ApiProperty({ description: 'Genre of the movie', type: () => Genre })
  @ManyToOne(() => Genre, (genre) => genre.movies, { eager: true })
  genre: Genre;

  @ApiProperty({ description: 'Director of the movie', type: () => Director })
  @ManyToOne(() => Director, (director) => director.movies, { eager: true })
  director: Director;

  @ApiProperty({ description: 'Date when the movie was created in the system' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the movie was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
} 