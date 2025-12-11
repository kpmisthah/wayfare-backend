import { Inject, Injectable } from '@nestjs/common';
import { ITripRepository } from 'src/domain/repositories/trip/trip.repository.interface';
import { IProfileRepository } from 'src/domain/repositories/user/profile.repository.interface';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { PROFILE_TYPE } from 'src/domain/types';
import { TravellersMapper } from '../../mapper/travellers.mapper';
import { TravellersDto } from 'src/application/dtos/travellers.dto';
import { ITravellersUsecase } from '../interfaces/travellers.usecase.interface';

@Injectable()
export class TravellersUsecase implements ITravellersUsecase {
  constructor(
    @Inject('ITripRepository')
    private readonly _tripRepo: ITripRepository,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    @Inject(PROFILE_TYPE.IProfileRepository)
    private readonly _profileRepo: IProfileRepository,
  ) {}
  async fetchTravellers(
    destination: string,
    userId: string,
  ): Promise<TravellersDto[]> {
    const tripPlan = await this._tripRepo.findTravellersByDestination(
      destination,
      userId,
    );
    const users = await Promise.all(
      tripPlan.map((trip) => this._userRepo.findById(trip.userId)),
    );
    const userProfile = await Promise.all(
      users.map((user) =>
        user ? this._profileRepo.findByUserId(user.id) : Promise.resolve(null),
      ),
    );
    return TravellersMapper.toTravellersDto(users, tripPlan, userProfile);
  }

  async fetchTravellersByUserDestinations(
    userId: string,
  ): Promise<TravellersDto[]> {
    const destinations = await this._tripRepo.findDestinationByUserId(userId);
    if (!destinations.length) return [];
    const trips = await this._tripRepo.findTravellersByDestinations(
      destinations,
      userId,
    );
    return TravellersMapper.toWholeTravellersDto(trips);
  }
}
