import { Inject, Injectable } from '@nestjs/common';
import { AiTripEntity } from '../../../../domain/entities/ai.trip.entity';
import { TripRepository } from '../../../../infrastructure/database/prisma/repositories/trip/trip.repository';
import { ISaveTrip } from '../interafaces/save-trip.usecase.interface';
import { TripMapper } from '../../mapper/trip.mapper';
import { TripDto } from '../../../dtos/Trip.dto';
import { SaveTripDto } from '../../../dtos/Save-ai-trip.dto';

@Injectable()
export class SaveTrip implements ISaveTrip {
  constructor(
    @Inject('ITripRepository')
    private readonly _tripRepo: TripRepository,
  ) {}
  async saveTrip(
    userId: string,
    response: SaveTripDto,
    startDate: string,
    visibility: boolean,
    preferences?: {
      activities?: string[];
      pace?: string;
      interests?: string[];
    },
  ): Promise<TripDto> {
    console.log(
      startDate,
      'startDate in savetrip and',
      visibility,
      'in savTripp',
      preferences,
      'preferences received',
    );

    const createAiTrip = AiTripEntity.create({
      userId,
      duration: response.duration,
      destination: response.destination,
      budget: response.budget,
      travelerType: response.travelerType,
      hotels: response.hotels,
      itinerary: response.itinerary,
      startDate,
      visibility,
      preferences: preferences || null,
    });
    console.log(createAiTrip, 'entity aftrer creatrign');

    const aiTripPlan = await this._tripRepo.createAiTrip(createAiTrip);
    return TripMapper.toTripDto(aiTripPlan);
  }
}
