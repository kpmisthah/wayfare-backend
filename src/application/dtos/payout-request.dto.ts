import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PayoutStatus } from '../../domain/enums/payout-status.enum';

export class PayoutRequestDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  agencyId: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  status: PayoutStatus;
}
