import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/infrastructure/database/prisma/repositories/base.repository';
import { TransportationEntity } from 'src/domain/entities/transportation.entity';
import { PrismaService } from '../../prisma.service';
import { TransportationMapper } from 'src/infrastructure/mappers/transportation.mapper';
import { ITransportationRepository } from 'src/domain/repositories/agency/transportation.repository';

@Injectable()
export class TransportationRepository
  extends BaseRepository<TransportationEntity>
  implements ITransportationRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.transportation, TransportationMapper);
  }
  async getTransportations(): Promise<TransportationEntity[]> {
    const transportation = await this._prisma.transportation.findMany();
    return transportation.map((transp) => {
      return TransportationMapper.toDomain(transp);
    });
  }
}
