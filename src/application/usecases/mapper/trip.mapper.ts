import { TripDto } from 'src/application/dtos/Trip.dto';
import { AiTripEntity } from 'src/domain/entities/ai.trip.entity';

export class TripMapper {
  static toTripDto(aiTripEntity: AiTripEntity): TripDto {
    return {
      id: aiTripEntity.id,
      userId: aiTripEntity.userId,
      destination: aiTripEntity.destination,
      duration: aiTripEntity.duration,
      budget: aiTripEntity.budget,
      travelerType: aiTripEntity.travelerType,
      hotels: aiTripEntity.hotels,
      itinerary: aiTripEntity.itinerary,
    };
  }

  static toTripsDto(aiTripsEntity:AiTripEntity[]):TripDto[] {
    return aiTripsEntity.map((aiTrip)=>{
      return TripMapper.toTripDto(aiTrip)
    })
  }
}
