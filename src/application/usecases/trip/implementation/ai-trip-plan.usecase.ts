import { Inject, Injectable } from '@nestjs/common';
import { TripRepository } from 'src/infrastructure/database/prisma/repositories/trip/trip.repository';
import { IAiTripPlanUsecase } from '../interafaces/ai-trip-plan.usecase.interface';
import { TripDto } from 'src/application/dtos/Trip.dto';
import { TripMapper } from '../../mapper/trip.mapper';
import { ITripRepository } from 'src/domain/repositories/trip/trip.repository.interface';

@Injectable()
export class AiTripPlanUsecase implements IAiTripPlanUsecase {
  constructor(
    @Inject('ITripRepository')
    private readonly _tripRepo: ITripRepository,
  ) {}
  async fetchTripPlan(id: string): Promise<TripDto | null> {
    const result = await this._tripRepo.findById(id);
    if (!result) return null;
    return TripMapper.toTripDto(result);
  }

  async fetchAllTrip(userId:string):Promise<TripDto[]|null>{
    const result = await this._tripRepo.findByUserId(userId)
    return TripMapper.toTripsDto(result)
  }
}
