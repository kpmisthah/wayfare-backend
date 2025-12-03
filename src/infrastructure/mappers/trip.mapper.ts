import { Prisma, TripPlan } from '@prisma/client';
import { AiTripEntity } from 'src/domain/entities/ai.trip.entity';
import { DayPlan, Hotel } from 'src/domain/types/ai.trip.type';

type TripWithUserProfile = Prisma.TripPlanGetPayload<{
  include: {
    user: {
      include: {
        userProfile: true;
      };
    };
  };
}>;

export class TripMapper {
  static toPrisma(trip: AiTripEntity): Prisma.TripPlanCreateInput {
    return {
      destination: trip.destination,
      duration: trip.duration,
      budget: trip.budget,
      travelerType: trip.travelerType,
      hotels: trip.hotels as unknown as Prisma.InputJsonValue,
      itinerary: trip.itinerary as unknown as Prisma.InputJsonValue,
      user: { connect: { id: trip.userId } },
      startDate: trip.startDate,
      visibility: trip.visibility,
    };
  }

  static toDomain(trip: TripPlan): AiTripEntity {
    return new AiTripEntity(
      trip.id,
      trip.userId,
      trip.duration,
      trip.destination,
      trip.budget,
      trip.travelerType,
      trip.hotels as unknown as Hotel[],
      trip.itinerary as unknown as DayPlan[],
      trip.startDate,
      trip.visibility,
    );
  }
  static toDomainMany(trips: TripPlan[]): AiTripEntity[] {
    return trips.map((trip) => {
      return TripMapper.toDomain(trip);
    });
  }

  static toTravellerDomain(trip: TripWithUserProfile): AiTripEntity {
    return new AiTripEntity(
      trip.id,
      trip.userId,
      trip.duration,
      trip.destination,
      trip.budget,
      trip.travelerType,
      trip.hotels as unknown as Hotel[],
      trip.itinerary as unknown as DayPlan[],
      trip.startDate,
      trip.visibility,
      trip.user?.name ?? '',
      trip.user?.profileImage ?? '',
      trip.user?.userProfile?.location ?? '',
    );
  }
  static toTravellersDomain(trips: TripWithUserProfile[]): AiTripEntity[] {
    return trips.map((trip) => {
      return TripMapper.toTravellerDomain(trip);
    });
  }
}
