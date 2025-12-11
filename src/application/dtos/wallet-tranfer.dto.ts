import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class WalletTransferDto {
  @IsString()
  id: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  transactionType: string;

  @IsString()
  paymentStatus: string;

  date: Date;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  agencyId?: string;

  @IsOptional()
  booking?: {
    id: string;
    bookingCode: string;
    travelDate: string;
    package?: {
      id: string;
      itineraryName?: string;
      destination?: string;
    };
  };

  @IsOptional()
  agency?: {
    id: string;
    user?: {
      name: string;
    };
  };
}
