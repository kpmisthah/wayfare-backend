import { TravellersDto } from 'src/application/dtos/travellers.dto';

export interface ITravellersUsecase {
  fetchTravellers(
    destination: string,
    userId: string,
  ): Promise<TravellersDto[]>;
  fetchTravellersByUserDestinations(userId: string): Promise<TravellersDto[]>;
}
