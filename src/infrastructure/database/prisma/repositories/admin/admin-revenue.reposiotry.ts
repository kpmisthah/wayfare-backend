import { Injectable } from '@nestjs/common';
import {
  IAdminRevenueRepository,
  TransactionSummaryResult,
} from 'src/domain/repositories/admin/admin-revenue.repository.interface';
import { PrismaService } from '../../prisma.service';
import { $Enums, Prisma } from '@prisma/client';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { Transaction } from 'src/domain/enums/transaction.enum';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { WalletTransactionEnum } from 'src/domain/enums/wallet-transaction.enum';

export interface WalletTransactionWithRelations {
  id: string;
  walletId: string;
  amount: number;
  type: $Enums.TransactionType;
  createdAt: Date;
  status: $Enums.PaymentStatus;
  agencyId: string | null;
  bookingId: string | null;
  category: $Enums.WalletTransactionType;
  agency?: {
    user: {
      name: string;
    };
  } | null;
  booking?: {
    bookingCode: string;
    package: {
      destination: string | null;
    };
    agency: {
      user: {
        name: string;
      };
    };
  } | null;
}

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

  async getAllCommission(): Promise<number> {
    const totalCommission = await this._prisma.booking.aggregate({
      _sum: {
        platformEarning: true,
      },
    });

    return totalCommission._sum.platformEarning ?? 0;
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

  async getTransactionSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<TransactionSummaryResult> {
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: Prisma.WalletTransactionWhereInput = {
      category: $Enums.WalletTransactionType.ADMIN_CREDIT,
    };

    // If search is provided, search by agency name (from booking) or destination
    if (search && search.trim()) {
      whereClause.OR = [
        {
          booking: {
            agency: {
              user: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          },
        },
        {
          booking: {
            package: {
              destination: { contains: search, mode: 'insensitive' },
            },
          },
        },
        {
          booking: {
            bookingCode: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const total = await this._prisma.walletTransaction.count({
      where: whereClause,
    });

    const transactions = await this._prisma.walletTransaction.findMany({
      where: whereClause,
      include: {
        agency: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        booking: {
          select: {
            bookingCode: true,
            package: {
              select: {
                destination: true,
              },
            },
            agency: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    
    const data = transactions.map((tx) =>
      this.toDomainWithRelations(tx as WalletTransactionWithRelations),
    );

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  private toDomainWithRelations(
    tx: WalletTransactionWithRelations,
  ): WalletTransactionEntity & {
    agencyName?: string;
    destination?: string;
    bookingCode?: string;
  } {
    const entity = new WalletTransactionEntity(
      tx.id,
      tx.walletId,
      tx.amount,
      tx.type as unknown as Transaction,
      tx.status as unknown as PaymentStatus,
      tx.category as unknown as WalletTransactionEnum,
      tx.createdAt,
      tx.bookingId ?? undefined,
      tx.agencyId ?? undefined,
    );

    const agencyName =
      tx.agency?.user?.name ?? tx.booking?.agency?.user?.name ?? undefined;

    const destination = tx.booking?.package?.destination || undefined;

    // Extend with relation data
    return Object.assign(entity, {
      agencyName,
      destination,
      bookingCode: tx.booking?.bookingCode ?? undefined,
    });
  }
}
