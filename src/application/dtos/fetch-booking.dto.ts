import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';

export class FetchBookingDto {
  @IsString()
  id: string;

  @IsString()
  customer: string;

  @IsString()
  destination: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @Type(() => Number)
  budget: number;

  status: BookingStatus;
}
