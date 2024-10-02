import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cashe.service';
import { RedisConfigService } from './config/redis.config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.registerAsync(RedisConfigService())],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
