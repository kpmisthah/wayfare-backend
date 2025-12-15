import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { ItineraryEntity } from '../../../../../domain/entities/itinerary.entity';
import { PrismaService } from '../../prisma.service';
import { IItineraryRepository } from '../../../../../domain/repositories/agency/itenerary.repository';
import { IteneraryMapper } from '../../../../mappers/itenerary.mapper';

@Injectable()
export class ItineraryRepository
  extends BaseRepository<ItineraryEntity>
  implements IItineraryRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.itenerary, IteneraryMapper);
  }
  async getIteneraries(): Promise<ItineraryEntity[] | null> {
    const itineraries = await this._prisma.itenerary.findMany();
    if (!itineraries.length) return null;
    return IteneraryMapper.toDomains(itineraries);
  }

  async findByItenerary(packageId: string): Promise<ItineraryEntity[] | null> {
    const getAgencyItineraries = await this._prisma.itenerary.findMany({
      where: { packageId },
    });
    return IteneraryMapper.toDomains(getAgencyItineraries);
  }
}
