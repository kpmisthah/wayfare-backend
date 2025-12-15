import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Transaction } from '../../domain/enums/transaction.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { WalletTransactionEnum } from '../../domain/enums/wallet-transaction.enum';

export class WalletTransactionDto {
  @IsString()
  id: string;

  date: Date;

  @IsNumber()
  @Type(() => Number)
  commission: number;

  type: Transaction;

  @IsOptional()
  @IsString()
  agencyName?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  bookingCode?: string;

  status: PaymentStatus;

  category: WalletTransactionEnum;
}
