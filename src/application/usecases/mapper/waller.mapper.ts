import { RecentWalletTxDto } from 'src/application/dtos/recent-wallet.dto';
import { WalletTransferDto } from 'src/application/dtos/wallet-tranfer.dto';
import { WalletDto } from 'src/application/dtos/wallet.dto';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { WalletEntity } from 'src/domain/entities/wallet.entity';

export class WalletMapper {
  static toWalletDto(walletEntity: WalletEntity): WalletDto {
    return {
      id: walletEntity.id,
      userId: walletEntity.userId,
      balance: walletEntity.balance,
    };
  }
  static toWalletTransactionDto(
    walletTransactionEntity: WalletTransactionEntity,
  ): WalletTransferDto {
    return {
      id: walletTransactionEntity.id,
      amount: walletTransactionEntity.amount,
      transactionType: walletTransactionEntity.transactionType,
      paymentStatus: walletTransactionEntity.paymentStatus,
      date: walletTransactionEntity.createdAt,
    };
  }
  static toWalletTransactionsDto(
    walletTransactionEntity: WalletTransactionEntity[],
  ): WalletTransferDto[] {
    return walletTransactionEntity.map((transaction) =>
      this.toWalletTransactionDto(transaction),
    );
  }

  static toRecentWalletTxDto(entity): RecentWalletTxDto {
    return {
      id: entity.id,
      amount: entity.amount,
      status: entity.status,
      name: entity.booking?.user?.name ?? 'N/A',
      destination: entity.booking?.package?.destination ?? 'N/A',
      createdAt: entity.createdAt,
    };
  }

  static toRecentWalletTxListDto(entities): RecentWalletTxDto[] {
    return entities.map((t) => this.toRecentWalletTxDto(t));
  }
}
