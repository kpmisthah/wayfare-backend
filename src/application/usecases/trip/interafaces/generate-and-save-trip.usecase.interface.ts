import { GenerateTripDto } from 'src/application/dtos/generate-trip.dto';
import { TripDto } from 'src/application/dtos/Trip.dto';

export interface IGenerateAndSaveTrip {
  execute(userId: string, dto: GenerateTripDto): Promise<TripDto>;
}
