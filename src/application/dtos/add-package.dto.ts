import { IsNumber, IsString } from 'class-validator';
import { itineraryDto } from './create-itenerary.dto';
import { PackageStatus } from 'src/domain/enums/package-status.enum';
import { Type } from 'class-transformer';

export class PackageDto {
  id: string;
  @IsString()
  title: string;
  @IsString()
  destination: string;
  @IsString()
  description: string;
  @IsString()
  highlights: string;

  @IsNumber()
  @Type(() => Number)
  duration: number;
  picture: string[];

  @IsNumber()
  @Type(() => Number)
  price: number;
  itinerary: itineraryDto[];
  status: PackageStatus;
  vehicle: string;
  pickup_point: string;
  drop_point: string;
  details: string;
}
