import { GenerateTripDto } from 'src/application/dtos/generate-trip.dto';

export interface IGenerateTripUsecase {
  execute(dto: GenerateTripDto): Promise<string>;
}
