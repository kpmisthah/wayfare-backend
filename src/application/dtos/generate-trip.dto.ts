import { IsString, Min, Max, IsDateString } from 'class-validator';
export class GenerateTripDto {
  @IsString()
  destination: string;

  @Min(1)
  @Max(5)
  duration: number;

  @IsString()
  travelerType: string;

  @IsString()
  budget: string;

  @IsDateString()
  startDate: string;

  visiblity: boolean;
}
