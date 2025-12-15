import { $Enums, Prisma, Transaction } from '@prisma/client';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { Role } from '../../domain/enums/role.enum';

export class TransactionMapper {
  static toDomain(transaction: Transaction): TransactionEntity {
    return new TransactionEntity(
      transaction.id,
      transaction.bookingId ?? '',
      transaction.agencyId,
      transaction.paymentIntentId,
      transaction.currency,
      transaction.status as PaymentStatus,
      transaction.amount,
      transaction.initiatedBy as Role,
    );
  }

  static toPrisma(
    transactionEntity: TransactionEntity,
  ): Prisma.TransactionCreateInput {
    return {
      booking: { connect: { id: transactionEntity.bookingId } },
      agency: { connect: { id: transactionEntity.agencyId } },
      paymentIntentId: transactionEntity.paymentIntentId,
      currency: transactionEntity.currency,
      status: transactionEntity.status as $Enums.PaymentStatus,
      amount: transactionEntity.amount,
      initiatedBy: transactionEntity.initiatedBy,
    };
  }
}
