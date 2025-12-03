import { $Enums, Prisma, WalletTransaction } from '@prisma/client';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { Transaction } from 'src/domain/enums/transaction.enum';
import { WalletTransactionEnum } from 'src/domain/enums/wallet-transaction.enum';
export class WalletTransactionMapper {
  static toDomain(
    walletTransaction: WalletTransaction,
  ): WalletTransactionEntity {
    return new WalletTransactionEntity(
      walletTransaction.id,
      walletTransaction.walletId,
      walletTransaction.amount,
      walletTransaction.type as Transaction,
      walletTransaction.status as PaymentStatus,
      walletTransaction.category as WalletTransactionEnum,
      walletTransaction.createdAt,
      walletTransaction.bookingId ?? '',
      walletTransaction.agencyId ?? '',
    );
  }

  static toPrisma(
    walletTransactionEntity: WalletTransactionEntity,
  ): Prisma.WalletTransactionCreateInput {
    const prismaObj: Prisma.WalletTransactionCreateInput = {
      wallet: { connect: { id: walletTransactionEntity.walletId } },
      amount: walletTransactionEntity.amount,
      type: walletTransactionEntity.transactionType as $Enums.TransactionType,
      status: walletTransactionEntity.paymentStatus,
      category:
        walletTransactionEntity.category as $Enums.WalletTransactionType,
    };

    if (walletTransactionEntity.bookingId) {
      prismaObj.booking = {
        connect: { id: walletTransactionEntity.bookingId },
      };
    }

    if (walletTransactionEntity.agencyId) {
      prismaObj.agency = { connect: { id: walletTransactionEntity.agencyId } };
    }

    return prismaObj;
  }
  static toEntity(
    walletTransaction: WalletTransaction,
  ): WalletTransactionEntity {
    return this.toDomain(walletTransaction);
  }
}
