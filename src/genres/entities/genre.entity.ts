import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('genres')
export class Genre {
  @ApiProperty({ description: 'Unique identifier for the genre', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the genre', example: 'Science Fiction', maxLength: 100 })
  @Column({ unique: true, length: 100 })
  name: string;

  @ApiProperty({ description: 'Description of the genre', example: 'Movies that explore futuristic concepts, advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Movies that belong to this genre', type: () => [Movie], required: false })
  @OneToMany(() => Movie, (movie) => movie.genre)
  movies: Movie[];

  @ApiProperty({ description: 'Date when the genre was created in the system' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the genre was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
} 