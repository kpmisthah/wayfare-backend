import { Injectable } from '@nestjs/common';
import { IAdminRevenueRepository } from 'src/domain/repositories/admin/admin-revenue.repository.interface';
import { PrismaService } from '../../prisma.service';
import { $Enums } from '@prisma/client';
import { WalletTransactionMapper } from 'src/infrastructure/mappers/wallet-transaction.mapper';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';

@Injectable()
export class AdminRevenueRepository implements IAdminRevenueRepository {
  constructor(private readonly _prisma: PrismaService) {}
  async getAllRevenue() {
    const totalStripeTransaction = await this._prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: $Enums.PaymentStatus.SUCCEEDED,
      },
    });

    const totalWalletTransaction =
      await this._prisma.walletTransaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: $Enums.PaymentStatus.SUCCEEDED,
          type: $Enums.TransactionType.DEBIT,
        },
      });

    const totalRevenue =
      (totalStripeTransaction._sum.amount || 0) +
      (totalWalletTransaction._sum.amount || 0);
    return totalRevenue;
  }

  async getAllCommission() {
    const totalCommission = await this._prisma.booking.aggregate({
      _sum: {
        platformEarning: true,
      },
    });

    return totalCommission;
  }
  async getWalletBalance() {
    const walleBalance = await this._prisma.wallet.aggregate({
      _sum: {
        balance: true,
      },
      where: {
        user: {
          role: $Enums.Role.ADMIN,
        },
      },
    });
    return walleBalance._sum.balance;
  }

  async activeAgenciesCount() {
    const agencyCount = await this._prisma.agency.count({
      where: { status: $Enums.AgencyStatus.ACTIVE },
    });
    return agencyCount;
  }

  async getTransactionSummary(): Promise<WalletTransactionEntity[]> {
    const transaction = await this._prisma.walletTransaction.findMany({
      where: {
        category: $Enums.WalletTransactionType.ADMIN_CREDIT,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    return transaction.map((tx) => WalletTransactionMapper.toDomain(tx));
  }
}
