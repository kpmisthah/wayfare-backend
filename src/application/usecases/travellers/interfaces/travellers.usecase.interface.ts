import { TravellersDto } from '../../../dtos/travellers.dto';

export interface ITravellersUsecase {
  fetchTravellers(
    destination: string,
    userId: string,
  ): Promise<TravellersDto[]>;
  fetchTravellersByUserDestinations(userId: string): Promise<TravellersDto[]>;
}
