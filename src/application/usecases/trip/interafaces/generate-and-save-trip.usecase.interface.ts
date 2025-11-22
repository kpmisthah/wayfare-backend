import { GenerateTripDto } from 'src/application/dtos/generate-trip.dto';

export interface IGenerateAndSaveTrip {
  execute(userId: string, dto: GenerateTripDto);
}
