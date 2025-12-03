import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Transaction } from 'src/domain/enums/transaction.enum';

export class WalletTransactionDto {
  @IsString()
  id: string;

  date: Date;

  @IsNumber()
  @Type(() => Number)
  commission: number;

  type: Transaction;
}
