import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IRedisService } from '../../domain/interfaces/redis-service.interface';

@Injectable()
export class RedisService implements IRedisService {
  private _client: Redis;

  constructor() {
    this._client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }
  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this._client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this._client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this._client.get(key);
  }

  async del(key: string) {
    await this._client.del(key);
  }
}
