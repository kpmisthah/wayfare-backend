import { GenerateTripDto } from '../../../dtos/generate-trip.dto';

export interface IGenerateTripUsecase {
  execute(dto: GenerateTripDto): Promise<string>;
}
