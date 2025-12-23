import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { WalletTransactionEntity } from '../../../../../domain/entities/wallet-transaction.entity';
import { IWalletTransactionRepository } from '../../../../../domain/repositories/wallet/wallet-transaction.repository.interface';
import { PrismaService } from '../../prisma.service';
import { WalletTransactionMapper } from '../../../../mappers/wallet-transaction.mapper';
import { PaymentStatus } from '../../../../../domain/enums/payment-status.enum';

@Injectable()
export class WalletTransactionRepository
  extends BaseRepository<WalletTransactionEntity>
  implements IWalletTransactionRepository {
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.walletTransaction, WalletTransactionMapper);
  }

  async findByBookingId(
    bookingId: string,
  ): Promise<WalletTransactionEntity | null> {
    const walletTransaciton = await this._prisma.walletTransaction.findFirst({
      where: { bookingId },
    });
    if (!walletTransaciton) return null;
    return WalletTransactionMapper.toDomain(walletTransaciton);
  }

  async findAgencyCreditByBookingId(
    bookingId: string,
    agencyId: string,
  ): Promise<WalletTransactionEntity | null> {
    const walletTransaction = await this._prisma.walletTransaction.findFirst({
      where: {
        bookingId,
        agencyId,
        type: 'CREDIT',
        category: 'AGENCY_CREDIT',
      },
    });
    if (!walletTransaction) return null;
    return WalletTransactionMapper.toDomain(walletTransaction);
  }
  async getTransactionsByWalletId(
    walletId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this._prisma.walletTransaction.findMany({
        where: {
          walletId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        include: {
          booking: {
            select: {
              id: true,
              bookingCode: true,
              travelDate: true,
              package: {
                select: {
                  id: true,
                  itineraryName: true,
                  destination: true,
                },
              },
            },
          },
          agency: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      this._prisma.walletTransaction.count({
        where: { walletId },
      }),
    ]);

    return {
      data: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAgencyByCredits(): Promise<WalletTransactionEntity[]> {
    const transaction = await this._prisma.walletTransaction.findMany({
      where: { status: PaymentStatus.PENDING },
    });
    return transaction.map((txn) => WalletTransactionMapper.toEntity(txn));
  }

  async getWalletSummary(agencyId: string) {
    const creditAmount = await this._prisma.walletTransaction.aggregate({
      where: {
        agencyId,
        status: PaymentStatus.SUCCEEDED,
        type: 'CREDIT',
      },
      _sum: { amount: true },
    });

    const debitAmount = await this._prisma.walletTransaction.aggregate({
      where: {
        agencyId,
        status: PaymentStatus.SUCCEEDED,
        type: 'DEBIT',
      },
      _sum: { amount: true },
    });

    const walletAmount =
      (creditAmount._sum.amount || 0) - (debitAmount._sum.amount || 0);

    const wholeAmount =
      (creditAmount._sum.amount || 0) - (debitAmount._sum.amount || 0);

    const pendingCredit = await this._prisma.walletTransaction.aggregate({
      where: { agencyId, status: PaymentStatus.PENDING, type: 'CREDIT' },
      _sum: { amount: true },
    });

    const pendingDebit = await this._prisma.walletTransaction.aggregate({
      where: { agencyId, status: PaymentStatus.PENDING, type: 'DEBIT' },
      _sum: { amount: true },
    });

    const pendingWalletAmount =
      (pendingCredit._sum.amount || 0) - (pendingDebit._sum.amount || 0);

    return {
      walletAmount,
      wholeWalletAmount: wholeAmount,
      pendingWalletAmount,
    };
  }

  async getRecentAgencyWalletTransactions(agencyId: string, limit: number) {
    return await this._prisma.walletTransaction.findMany({
      where: { agencyId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        booking: {
          select: {
            id: true,
            package: {
              select: {
                destination: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
