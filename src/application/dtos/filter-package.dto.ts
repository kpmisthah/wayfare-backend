import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  vehicle?: string;

  @IsOptional()
  @IsString()
  durationFilter?: string; // 'short', 'medium', 'long', 'all'

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
