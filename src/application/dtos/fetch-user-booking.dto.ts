import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { BookingStatus } from '../../domain/enums/booking-status.enum';

export class FetchUserBookingDto {
  @IsString()
  id: string;

  @IsString()
  destination: string;

  @IsString()
  agencyName?: string;

  @IsNumber()
  @Type(() => Number)
  travellers: number;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsString()
  photo: string[];

  bookingStatus: BookingStatus;

  @IsString()
  highlights: string;

  @IsDateString()
  travelDate: string;

  bookingCode: string;
}
