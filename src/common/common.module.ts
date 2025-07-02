import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { UploadService } from './services/upload.service';
import { CacheService } from './services/cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD', ''),
        ttl: 300, // 5 minutes default TTL
        max: 1000, // Maximum number of items in cache
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  providers: [UploadService, CacheService],
  exports: [UploadService, CacheService, CacheModule],
})
export class CommonModule {}
