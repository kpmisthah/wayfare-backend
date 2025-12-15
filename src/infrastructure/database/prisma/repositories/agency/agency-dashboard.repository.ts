import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  IAgencyDashboardRepository,
  AgencyDashboardData,
  RecentBooking,
} from '../../../../../domain/repositories/agency/agency-dashboard.repository.interface';
import { BookingStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class AgencyDashboardRepository implements IAgencyDashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string): Promise<AgencyDashboardData> {
    console.log(`[AgencyDashboard] Fetching data for userId: ${userId}`);
    const agency = await this.prisma.agency.findUnique({
      where: { userId },
    });

    if (!agency) {
      console.error(
        `[AgencyDashboard] Agency profile not found for userId: ${userId}`,
      );
      throw new NotFoundException('Agency profile not found');
    }

    const agencyId = agency.id;
    console.log(`[AgencyDashboard] Found agencyId: ${agencyId}`);

    const totalPackages = await this.prisma.package.count({
      where: { agencyId },
    });
    console.log(`[AgencyDashboard] Total Packages: ${totalPackages}`);

    const activeBookings = await this.prisma.booking.count({
      where: {
        agencyId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
      },
    });
    console.log(`[AgencyDashboard] Active Bookings: ${activeBookings}`);

    const revenueResult = await this.prisma.booking.aggregate({
      _sum: {
        agencyEarning: true,
      },
      where: {
        agencyId,
        status: { in: [BookingStatus.COMPLETED, BookingStatus.CONFIRMED] },
      },
    });
    const totalRevenue = revenueResult._sum.agencyEarning || 0;
    console.log(`[AgencyDashboard] Total Revenue: ${totalRevenue}`);

    const bookings = await this.prisma.booking.findMany({
      where: { agencyId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        package: { select: { destination: true } },
      },
    });
    console.log(`[AgencyDashboard] Found ${bookings.length} recent bookings`);

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
