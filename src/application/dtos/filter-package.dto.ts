import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class FilterPackageDto {
  @IsString()
  destination: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Type(() => Number)
  travelers: number;

  @IsNumber()
  @Type(() => Number)
  minBudget: number;

  @IsNumber()
  @Type(() => Number)
  maxBudget: number;
}
