import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { IWalletTransactionRepository } from 'src/domain/repositories/wallet/wallet-transaction.repository.interface';
import { PrismaService } from '../../prisma.service';
import { WalletTransactionMapper } from 'src/infrastructure/mappers/wallet-transaction.mapper';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';

@Injectable()
export class WalletTransactionRepository
  extends BaseRepository<WalletTransactionEntity>
  implements IWalletTransactionRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.walletTransaction, WalletTransactionMapper);
  }

  async findByBookingId(bookingId:string):Promise<WalletTransactionEntity|null>{
    let walletTransaciton = await this._prisma.walletTransaction.findFirst({where:{bookingId}})
    if(!walletTransaciton) return null
    return WalletTransactionMapper.toDomain(walletTransaciton)
  }
  async getTransactionsByWalletId(
    walletId: string,
  ): Promise<WalletTransactionEntity[]> {
    const transactions = await this._prisma.walletTransaction.findMany({
      where: {
        walletId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return transactions.map((txn) => WalletTransactionMapper.toEntity(txn));
  }

  async findAgencyByCredits(): Promise<WalletTransactionEntity[]> {
    const transaction = await this._prisma.walletTransaction.findMany({
      where: { status: PaymentStatus.PENDING },
    });
    return transaction.map((txn) => WalletTransactionMapper.toEntity(txn));
  }

  async getWalletSummary(agencyId: string) {
    const successAmount = await this._prisma.walletTransaction.aggregate({
      where: {
        agencyId,
        status: PaymentStatus.SUCCEEDED,
      },
      _sum: { amount: true },
    });

    const wholeAmount = await this._prisma.walletTransaction.aggregate({
      where: { agencyId },
      _sum: { amount: true },
    });

    const pendingAmount = await this._prisma.walletTransaction.aggregate({
      where: { agencyId, status: PaymentStatus.PENDING },
      _sum: { amount: true },
    });
    const walletAmount = successAmount._sum.amount;
    const wholeWalletAmount = wholeAmount._sum.amount;
    const pendingWalletAmount = pendingAmount._sum.amount;
    return {
      walletAmount,
      wholeWalletAmount,
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
