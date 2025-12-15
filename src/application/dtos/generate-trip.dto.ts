import {
  IsString,
  Min,
  Max,
  IsDateString,
  IsOptional,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TripPreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[];

  @IsOptional()
  @IsIn(['relaxed', 'moderate', 'packed'])
  pace?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}

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

  @IsOptional()
  @ValidateNested()
  @Type(() => TripPreferencesDto)
  preferences?: TripPreferencesDto;
}
