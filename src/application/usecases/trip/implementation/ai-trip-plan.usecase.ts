import { Inject, Injectable } from '@nestjs/common';
import { IAiTripPlanUsecase, PaginationOptions, PaginatedTripsResponse } from '../interafaces/ai-trip-plan.usecase.interface';
import { TripDto } from 'src/application/dtos/Trip.dto';
import { TripMapper } from '../../mapper/trip.mapper';
import { ITripRepository } from 'src/domain/repositories/trip/trip.repository.interface';

@Injectable()
export class AiTripPlanUsecase implements IAiTripPlanUsecase {
  constructor(
    @Inject('ITripRepository')
    private readonly _tripRepo: ITripRepository,
  ) { }
  async fetchTripPlan(id: string): Promise<TripDto | null> {
    const result = await this._tripRepo.findById(id);
    if (!result) return null;
    return TripMapper.toTripDto(result);
  }

  async fetchAllTrip(userId: string, options?: PaginationOptions): Promise<PaginatedTripsResponse> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const search = options?.search || '';

    const { trips, total } = await this._tripRepo.findByUserIdPaginated(userId, {
      page,
      limit,
      search,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      trips: TripMapper.toTripsDto(trips),
      total,
      page,
      totalPages,
    };
  }
}
