import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../genres/entities/genre.entity';
import { Director } from '../directors/entities/director.entity';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    @InjectRepository(Director)
    private directorRepository: Repository<Director>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async seed(): Promise<void> {
    try {
      this.logger.log('Starting database seeding...');

      // Check if data already exists
      const genreCount = await this.genreRepository.count();
      if (genreCount > 0) {
        this.logger.log('Database already contains data. Skipping seed.');
        return;
      }

      // Seed genres
      const genres = await this.seedGenres();
      this.logger.log(`Seeded ${genres.length} genres`);

      // Seed directors
      const directors = await this.seedDirectors();
      this.logger.log(`Seeded ${directors.length} directors`);

      // Seed movies
      const movies = await this.seedMovies(genres, directors);
      this.logger.log(`Seeded ${movies.length} movies`);

      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Error during database seeding:', error);
      throw error;
    }
  }

  private async seedGenres(): Promise<Genre[]> {
    const genresData = [
      {
        name: 'Action',
        description: 'High-energy movies with intense action sequences',
      },
      {
        name: 'Drama',
        description: 'Character-driven stories with emotional themes',
      },
      {
        name: 'Comedy',
        description: 'Light-hearted movies designed to amuse and entertain',
      },
      {
        name: 'Sci-Fi',
        description: 'Science fiction movies exploring futuristic concepts',
      },
      {
        name: 'Thriller',
        description: 'Suspenseful movies designed to keep audiences on edge',
      },
      {
        name: 'Horror',
        description: 'Movies designed to frighten and create suspense',
      },
      {
        name: 'Romance',
        description: 'Movies centered around love stories',
      },
      {
        name: 'Adventure',
        description: 'Movies featuring exciting journeys and quests',
      },
    ];

    const genres: Genre[] = [];
    for (const genreData of genresData) {
      const genre = this.genreRepository.create(genreData);
      const savedGenre = await this.genreRepository.save(genre);
      genres.push(savedGenre);
    }

    return genres;
  }

  private async seedDirectors(): Promise<Director[]> {
    const directorsData = [
      {
        firstName: 'Christopher',
        lastName: 'Nolan',
        birthDate: new Date('1970-07-30'),
        nationality: 'British',
        biography: 'Christopher Nolan is a British-American film director, producer, and screenwriter known for his films that explore themes of time, memory, and reality.',
      },
      {
        firstName: 'Quentin',
        lastName: 'Tarantino',
        birthDate: new Date('1963-03-27'),
        nationality: 'American',
        biography: 'Quentin Tarantino is an American film director, screenwriter, and producer known for his non-linear storytelling and pop culture references.',
      },
      {
        firstName: 'Martin',
        lastName: 'Scorsese',
        birthDate: new Date('1942-11-17'),
        nationality: 'American',
        biography: 'Martin Scorsese is an American film director, producer, and screenwriter known for his gritty crime films and character studies.',
      },
      {
        firstName: 'Steven',
        lastName: 'Spielberg',
        birthDate: new Date('1946-12-18'),
        nationality: 'American',
        biography: 'Steven Spielberg is an American film director, producer, and screenwriter, one of the founding pioneers of the New Hollywood era.',
      },
      {
        firstName: 'Lana',
        lastName: 'Wachowski',
        birthDate: new Date('1965-06-21'),
        nationality: 'American',
        biography: 'Lana Wachowski is an American film and television director, writer, and producer known for The Matrix trilogy.',
      },
    ];

    const directors: Director[] = [];
    for (const directorData of directorsData) {
      const director = this.directorRepository.create(directorData);
      const savedDirector = await this.directorRepository.save(director);
      directors.push(savedDirector);
    }

    return directors;
  }

  private async seedMovies(genres: Genre[], directors: Director[]): Promise<Movie[]> {
    // Helper function to find genre by name
    const findGenre = (name: string) => genres.find(g => g.name === name);
    // Helper function to find director by name
    const findDirector = (firstName: string, lastName: string) => 
      directors.find(d => d.firstName === firstName && d.lastName === lastName);

    const moviesData = [
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology',
        releaseYear: 2010,
        duration: 148,
        rating: 8.8,
        synopsis: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.',
        genre: findGenre('Action'),
        director: findDirector('Christopher', 'Nolan'),
      },
      {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, and a gangster intertwine',
        releaseYear: 1994,
        duration: 154,
        rating: 8.9,
        synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        genre: findGenre('Drama'),
        director: findDirector('Quentin', 'Tarantino'),
      },
      {
        title: 'The Dark Knight',
        description: 'Batman faces the Joker in Gotham City',
        releaseYear: 2008,
        duration: 152,
        rating: 9.0,
        synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        genre: findGenre('Action'),
        director: findDirector('Christopher', 'Nolan'),
      },
      {
        title: 'Goodfellas',
        description: 'The story of Henry Hill and his life in the mob',
        releaseYear: 1990,
        duration: 146,
        rating: 8.7,
        synopsis: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.',
        genre: findGenre('Drama'),
        director: findDirector('Martin', 'Scorsese'),
      },
      {
        title: 'E.T. the Extra-Terrestrial',
        description: 'A young boy befriends an extraterrestrial',
        releaseYear: 1982,
        duration: 115,
        rating: 7.9,
        synopsis: 'A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.',
        genre: findGenre('Sci-Fi'),
        director: findDirector('Steven', 'Spielberg'),
      },
      {
        title: 'The Matrix',
        description: 'A hacker discovers reality is a simulation',
        releaseYear: 1999,
        duration: 136,
        rating: 8.7,
        synopsis: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
        genre: findGenre('Sci-Fi'),
        director: findDirector('Lana', 'Wachowski'),
      },
    ];

    const movies: Movie[] = [];
    for (const movieData of moviesData) {
      const movie = this.movieRepository.create(movieData);
      const savedMovie = await this.movieRepository.save(movie);
      movies.push(savedMovie);
    }

    return movies;
  }
} 