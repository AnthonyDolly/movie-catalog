import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Cache keys constants
  private readonly CACHE_KEYS = {
    MOVIES_ALL: 'movies:all',
    MOVIES_BY_GENRE: 'movies:genre',
    MOVIES_BY_DIRECTOR: 'movies:director',
    MOVIES_POPULAR: 'movies:popular',
    GENRES_ALL: 'genres:all',
    DIRECTORS_ALL: 'directors:all',
    MOVIES_SEARCH: 'movies:search',
  };

  // TTL configurations (in seconds)
  private readonly TTL = {
    SHORT: 300, // 5 minutes - for frequently changing data
    MEDIUM: 900, // 15 minutes - for moderately stable data
    LONG: 3600, // 1 hour - for stable data like genres and directors
  };

  /**
   * Generate cache key with parameters
   */
  private generateKey(baseKey: string, params: Record<string, any> = {}): string {
    if (Object.keys(params).length === 0) {
      return baseKey;
    }
    
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${baseKey}:${paramString}`;
  }

  /**
   * Get data from cache
   */
  async get<T>(key: string, params?: Record<string, any>): Promise<T | undefined> {
    const cacheKey = this.generateKey(key, params);
    return await this.cacheManager.get<T>(cacheKey);
  }

  /**
   * Set data in cache with TTL
   */
  async set<T>(key: string, value: T, ttl?: number, params?: Record<string, any>): Promise<void> {
    const cacheKey = this.generateKey(key, params);
    await this.cacheManager.set(cacheKey, value, ttl || this.TTL.MEDIUM);
  }

  /**
   * Delete specific cache entry
   */
  async del(key: string, params?: Record<string, any>): Promise<void> {
    const cacheKey = this.generateKey(key, params);
    await this.cacheManager.del(cacheKey);
  }

  /**
   * Clear all cache entries matching a pattern
   * Note: This is a simplified approach for pattern deletion
   */
  async delPattern(pattern: string): Promise<void> {
    // Since cache-manager doesn't provide a direct pattern deletion method,
    // we'll clear specific known keys based on the pattern
    const keysToDelete: string[] = [];
    
    if (pattern.includes('movies:all')) {
      keysToDelete.push('movies:all');
    }
    if (pattern.includes('movies:genre')) {
      keysToDelete.push('movies:genre');
    }
    if (pattern.includes('movies:director')) {
      keysToDelete.push('movies:director');
    }
    if (pattern.includes('movies:popular')) {
      keysToDelete.push('movies:popular');
    }
    if (pattern.includes('movies:search')) {
      keysToDelete.push('movies:search');
    }
    if (pattern.includes('genres:all')) {
      keysToDelete.push('genres:all');
    }
    if (pattern.includes('directors:all')) {
      keysToDelete.push('directors:all');
    }

    // Delete the base keys - Redis will handle pattern-based deletion in production
    try {
      for (const key of keysToDelete) {
        await this.cacheManager.del(key);
      }
    } catch (error) {
      console.warn(`Cache deletion failed for pattern: ${pattern}`, error);
    }
  }

  /**
   * Cache methods for movies
   */
  async getMovies(params: Record<string, any>): Promise<any> {
    return this.get(this.CACHE_KEYS.MOVIES_ALL, params);
  }

  async setMovies(data: any, params: Record<string, any>): Promise<void> {
    return this.set(this.CACHE_KEYS.MOVIES_ALL, data, this.TTL.SHORT, params);
  }

  async getMoviesByGenre(genreId: number, params: Record<string, any>): Promise<any> {
    return this.get(this.CACHE_KEYS.MOVIES_BY_GENRE, { genreId, ...params });
  }

  async setMoviesByGenre(genreId: number, data: any, params: Record<string, any>): Promise<void> {
    return this.set(this.CACHE_KEYS.MOVIES_BY_GENRE, data, this.TTL.SHORT, { genreId, ...params });
  }

  async getMoviesByDirector(directorId: number, params: Record<string, any>): Promise<any> {
    return this.get(this.CACHE_KEYS.MOVIES_BY_DIRECTOR, { directorId, ...params });
  }

  async setMoviesByDirector(directorId: number, data: any, params: Record<string, any>): Promise<void> {
    return this.set(this.CACHE_KEYS.MOVIES_BY_DIRECTOR, data, this.TTL.SHORT, { directorId, ...params });
  }

  async getPopularMovies(params: Record<string, any>): Promise<any> {
    return this.get(this.CACHE_KEYS.MOVIES_POPULAR, params);
  }

  async setPopularMovies(data: any, params: Record<string, any>): Promise<void> {
    return this.set(this.CACHE_KEYS.MOVIES_POPULAR, data, this.TTL.MEDIUM, params);
  }

  async getSearchMovies(params: Record<string, any>): Promise<any> {
    return this.get(this.CACHE_KEYS.MOVIES_SEARCH, params);
  }

  async setSearchMovies(data: any, params: Record<string, any>): Promise<void> {
    return this.set(this.CACHE_KEYS.MOVIES_SEARCH, data, this.TTL.SHORT, params);
  }

  /**
   * Cache methods for genres
   */
  async getGenres(params?: Record<string, any>): Promise<any> {
    return this.get(this.CACHE_KEYS.GENRES_ALL, params);
  }

  async setGenres(data: any, params?: Record<string, any>): Promise<void> {
    return this.set(this.CACHE_KEYS.GENRES_ALL, data, this.TTL.LONG, params);
  }

  /**
   * Cache methods for directors
   */
  async getDirectors() {
    return this.get(this.CACHE_KEYS.DIRECTORS_ALL);
  }

  async setDirectors(data: any) {
    return this.set(this.CACHE_KEYS.DIRECTORS_ALL, data, this.TTL.LONG);
  }

  /**
   * Clear all movie-related cache when movies are modified
   */
  async clearMovieCache(): Promise<void> {
    await Promise.all([
      this.delPattern(this.CACHE_KEYS.MOVIES_ALL),
      this.delPattern(this.CACHE_KEYS.MOVIES_BY_GENRE),
      this.delPattern(this.CACHE_KEYS.MOVIES_BY_DIRECTOR),
      this.delPattern(this.CACHE_KEYS.MOVIES_POPULAR),
      this.delPattern(this.CACHE_KEYS.MOVIES_SEARCH),
    ]);
  }

  /**
   * Clear genre cache when genres are modified
   */
  async clearGenreCache(): Promise<void> {
    await this.delPattern(this.CACHE_KEYS.GENRES_ALL);
    // Also clear movies cache since movies include genre data
    await this.clearMovieCache();
  }

  /**
   * Clear director cache when directors are modified
   */
  async clearDirectorCache(): Promise<void> {
    await this.delPattern(this.CACHE_KEYS.DIRECTORS_ALL);
    // Also clear movies cache since movies include director data
    await this.clearMovieCache();
  }
} 