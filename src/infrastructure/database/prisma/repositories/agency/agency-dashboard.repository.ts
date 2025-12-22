import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  IAgencyDashboardRepository,
  AgencyDashboardData,
  RecentBooking,
} from '../../../../../domain/repositories/agency/agency-dashboard.repository.interface';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class AgencyDashboardRepository implements IAgencyDashboardRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async getDashboardData(userId: string): Promise<AgencyDashboardData> {
    const agency = await this._prisma.agency.findUnique({
      where: { userId },
    });

    if (!agency) {
      throw new NotFoundException('Agency profile not found');
    }

    const agencyId = agency.id;

    const totalPackages = await this._prisma.package.count({
      where: { agencyId },
    });

    const activeBookings = await this._prisma.booking.count({
      where: {
        agencyId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
      },
    });

    const revenueResult = await this._prisma.booking.aggregate({
      _sum: {
        agencyEarning: true,
      },
      where: {
        agencyId,
        status: { in: [BookingStatus.COMPLETED, BookingStatus.CONFIRMED] },
      },
    });
    const totalRevenue = revenueResult._sum.agencyEarning || 0;

    const bookings = await this._prisma.booking.findMany({
      where: { agencyId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        package: { select: { destination: true } },
      },
    });

    const recentBookings: RecentBooking[] = bookings.map((b) => ({
      id: b.bookingCode || b.id,
      customerName: b.user.name,
      destination: b.package?.destination || 'Unknown',
      date: b.createdAt,
      totalCost: b.totalAmount,
      status: b.status,
    }));

    return {
      stats: {
        totalPackages,
        activeBookings,
        totalRevenue,
        happyCustomers: 0,
      },
      recentBookings,
      recentReviews: [],
    };
  }
}
