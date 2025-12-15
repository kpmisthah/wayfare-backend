import { Module, Global } from '@nestjs/common';
import { RedisService } from '../../utils/redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'IRedisService',
      useClass: RedisService,
    },
  ],
  exports: ['IRedisService'],
})
export class RedisModule {}
