import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { TransactionEntity } from '../../../../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../../../../domain/repositories/transaction/transaction.repository';
import { PrismaService } from '../../prisma.service';
import { TransactionMapper } from '../../../../mappers/transaction.mapper';
import { PaymentStatus } from '../../../../../domain/enums/payment-status.enum';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class TransactionRepository
  extends BaseRepository<TransactionEntity>
  implements ITransactionRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.transaction, TransactionMapper);
  }
  async findByBookingId(id: string): Promise<TransactionEntity | null> {
    const transaction = await this._prisma.transaction.findFirst({
      where: { bookingId: id },
      orderBy: { createdAt: 'desc' },
    });
    if (!transaction) return null;
    return TransactionMapper.toDomain(transaction);
  }

  async getTotalRevenue(): Promise<number> {
    const trxRevenue = await this._prisma.transaction.aggregate({
      where: { status: PaymentStatus.SUCCEEDED },
      _sum: { amount: true },
    });

    const walletRevenue = await this._prisma.walletTransaction.aggregate({
      where: { category: 'USER_PAYMENT' },
      _sum: { amount: true },
    });

    return (trxRevenue._sum.amount || 0) + (walletRevenue._sum.amount || 0);
  }

  async getRevenueOverview(): Promise<
    { month: string; revenue: number; bookings: number }[]
  > {
    const months: { label: string; start: Date; end: Date }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label = start.toLocaleString('default', { month: 'short' });

      months.push({ label, start, end });
    }

    const startDate = months[0].start;

    const trxPayments = await this._prisma.transaction.findMany({
      where: {
        status: PaymentStatus.SUCCEEDED,
        createdAt: { gte: startDate },
      },
      select: { amount: true, createdAt: true },
    });

    const walletPayments = await this._prisma.walletTransaction.findMany({
      where: {
        category: 'USER_PAYMENT',
        createdAt: { gte: startDate },
      },
      select: { amount: true, createdAt: true },
    });

    const revenueMap = new Map<string, { revenue: number; bookings: number }>();
    months.forEach((m) => revenueMap.set(m.label, { revenue: 0, bookings: 0 }));

    const addToMap = (items: { amount: number; createdAt: Date }[]) => {
      items.forEach((item) => {
        const label = item.createdAt.toLocaleString('default', {
          month: 'short',
        });
        const current = revenueMap.get(label);

        if (current) {
          current.revenue += item.amount;
          current.bookings += 1;
        }
      });
    };

    addToMap(trxPayments);
    addToMap(walletPayments);

    return months.map((m) => {
      const data = revenueMap.get(m.label);
      return {
        month: m.label,
        revenue: data?.revenue ?? 0,
        bookings: data?.bookings ?? 0,
      };
    });
  }
  async getBookingStatusDistribution(): Promise<
    { name: string; value: number; color: string }[]
  > {
    const bookingsByStatus = await this._prisma.booking.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });
    const totalBookings = bookingsByStatus.reduce(
      (sum, item) => sum + item._count.status,
      0,
    );

    if (totalBookings === 0) {
      return [];
    }

    const statusMap: Partial<
      Record<BookingStatus, { color: string; name: string }>
    > = {
      [BookingStatus.CONFIRMED]: { name: 'Confirmed', color: '#3B82F6' },
      [BookingStatus.PENDING]: { name: 'Pending', color: '#F59E0B' },
      [BookingStatus.CANCELLED]: { name: 'Cancelled', color: '#EF4444' },
    };

    return bookingsByStatus
      .map((item) => {
        const statusInfo = statusMap[item.status] || {
          name: item.status,
          color: '#A0A0A0',
        };
        const value = Math.round((item._count.status / totalBookings) * 100);

        return {
          name: statusInfo.name,
          value: value,
          color: statusInfo.color,
        };
      })
      .filter((data) => data.value > 0);
  }
}
