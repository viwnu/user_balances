import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}
  private readonly logger = new Logger(RedisCacheService.name);

  async get(key: string): Promise<number | null> {
    return await this.cacheService.get(key);
  }

  async set(key: string, value: number): Promise<void> {
    await this.cacheService.set(key, value);
  }
}
