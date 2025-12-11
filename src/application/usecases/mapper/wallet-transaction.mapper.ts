import { WalletTransactionDto } from 'src/application/dtos/wallet-transaction.dto';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';

interface ExtendedWalletTransactionEntity extends WalletTransactionEntity {
  agencyName?: string;
  destination?: string;
  bookingCode?: string;
}

export class WalletTransactionMapper {
  static toWalletTransactionDto(
    walletTransaction:
      | WalletTransactionEntity
      | ExtendedWalletTransactionEntity,
  ): WalletTransactionDto {
    const extended = walletTransaction as ExtendedWalletTransactionEntity;

    return {
      id: walletTransaction.id,
      date: walletTransaction.createdAt,
      commission: walletTransaction.amount,
      type: walletTransaction.transactionType,
      status: walletTransaction.paymentStatus,
      category: walletTransaction.category,
      agencyName: extended.agencyName,
      destination: extended.destination,
      bookingCode: extended.bookingCode,
    };
  }
}
