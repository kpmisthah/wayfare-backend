import { WalletTransactionDto } from 'src/application/dtos/wallet-transaction.dto';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';

export class WalletTransactionMapper {
  static toWalletTransactionDto(
    walletTransaction: WalletTransactionEntity,
  ): WalletTransactionDto {
    return {
      id: walletTransaction.id,
      date: walletTransaction.createdAt,
      commission: walletTransaction.amount,
      type: walletTransaction.transactionType,
    };
  }
}
