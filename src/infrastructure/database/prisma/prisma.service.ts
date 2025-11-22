import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  findUnique: any;
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('POSTGRES_DATABASE_URL'),
        },
      },
    });
  }
}
