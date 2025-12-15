import { GenerateTripDto } from '../../../dtos/generate-trip.dto';
import { TripDto } from '../../../dtos/Trip.dto';

export interface IGenerateAndSaveTrip {
  execute(userId: string, dto: GenerateTripDto): Promise<TripDto>;
}
