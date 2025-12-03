import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class BookingResponseDto {
  @IsString()
  id: string;
  startDate: string;
  @IsNumber()
  @Type(() => Number)
  duration: number;
  @IsString()
  title: string;
  @IsString()
  destination: string;
  @IsNumber()
  @Type(() => Number)
  travelers: number;
  @IsNumber()
  @Type(() => Number)
  totalAmount: number;
  @IsString()
  email: string;
}
