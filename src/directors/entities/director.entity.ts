import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('directors')
export class Director {
  @ApiProperty({ description: 'Unique identifier for the director', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'First name of the director', example: 'Christopher', maxLength: 100 })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Last name of the director', example: 'Nolan', maxLength: 100 })
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty({ description: 'Birth date of the director', example: '1970-07-30', required: false })
  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @ApiProperty({ description: 'Nationality of the director', example: 'British', maxLength: 100, required: false })
  @Column({ length: 100, nullable: true })
  nationality: string;

  @ApiProperty({ description: 'Biography of the director', example: 'Christopher Nolan is a British-American film director, producer, and screenwriter known for his films that explore themes of time, memory, and reality.', required: false })
  @Column({ type: 'text', nullable: true })
  biography: string;

  @ApiProperty({ description: 'Movies directed by this director', type: () => [Movie], required: false })
  @OneToMany(() => Movie, (movie) => movie.director)
  movies: Movie[];

  @ApiProperty({ description: 'Date when the director was created in the system' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the director was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to get full name
  @ApiProperty({ description: 'Full name of the director', example: 'Christopher Nolan' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 