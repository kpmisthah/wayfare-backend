import { Itenerary, Prisma } from '@prisma/client';
import { ItineraryEntity } from '../../domain/entities/itinerary.entity';

export class IteneraryMapper {
  static toDomain(itn: Itenerary): ItineraryEntity {
    return new ItineraryEntity(
      itn.id,
      itn.day ?? '',
      itn.activities ?? '',
      itn.meals ?? '',
      itn.accommodation ?? '',
      itn.packageId,
    );
  }

  static toPrisma(
    itineraryEntity: ItineraryEntity,
  ): Prisma.IteneraryCreateInput {
    return {
      day: String(itineraryEntity.day),
      activities: itineraryEntity.activities ?? '',
      meals: itineraryEntity.meals ?? '',
      accommodation: itineraryEntity.accommodation ?? '',
      package: { connect: { id: itineraryEntity.packageId } },
    };
  }
  static toDomains(itn: Itenerary[]): ItineraryEntity[] {
    return itn.map((itn) => {
      return IteneraryMapper.toDomain(itn);
    });
  }
}
