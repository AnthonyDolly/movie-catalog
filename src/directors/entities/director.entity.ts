import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('directors')
export class Director {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ length: 100, nullable: true })
  nationality: string;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @OneToMany(() => Movie, (movie) => movie.director)
  movies: Movie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to get full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 