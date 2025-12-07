import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IRedisService } from 'src/domain/interfaces/redis-service.interface';

@Injectable()
export class RedisService implements IRedisService {
  private client: Redis;

   constructor() {
    this.client = new Redis({
      host: process.env.NODE_ENV === 'production' ? 'redis' : 'localhost',
      port: 6379,
    });
  }
  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
