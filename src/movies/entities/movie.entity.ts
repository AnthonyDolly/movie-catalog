import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { Director } from '../../directors/entities/director.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  @Index() // Index for search performance
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  @Index() // Index for filtering by year
  releaseYear: number;

  @Column({ type: 'int', nullable: true })
  duration: number; // Duration in minutes

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating: number; // Rating from 0.0 to 10.0

  @Column({ length: 500, nullable: true })
  posterUrl: string;

  @Column({ type: 'text', nullable: true })
  synopsis: string;

  @ManyToOne(() => Genre, (genre) => genre.movies, { eager: true })
  genre: Genre;

  @ManyToOne(() => Director, (director) => director.movies, { eager: true })
  director: Director;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 