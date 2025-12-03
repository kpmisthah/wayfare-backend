import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class BookingDto {
  @IsString()
  packageId: string;
  travelDate: string;
  @IsNumber()
  @Type(() => Number)
  peopleCount: number;
  @Type(() => Number)
  totalAmount: number;
  @IsString()
  paymentType?: string;
}
