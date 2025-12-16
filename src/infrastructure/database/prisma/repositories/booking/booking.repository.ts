import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { BookingEntity } from '../../../../../domain/entities/booking.entity';
import { IBookingRepository } from '../../../../../domain/repositories/booking/booking.repository';
import { BookingMapper } from '../../../../mappers/booking.mapper';
import { BookingStatus } from '../../../../../domain/enums/booking-status.enum';

@Injectable()
export class BookingRepository
  extends BaseRepository<BookingEntity>
  implements IBookingRepository
{
  constructor(private _prisma: PrismaService) {
    super(_prisma.booking, BookingMapper);
  }
  async findByUserId(
    userId: string,
    options?: {
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: BookingEntity[]; total: number }> {
    const { search, status, page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.package = {
        OR: [
          { destination: { contains: search, mode: 'insensitive' } },
          { itineraryName: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [bookings, total] = await Promise.all([
      this._prisma.booking.findMany({
        where,
        include: { package: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this._prisma.booking.count({ where }),
    ]);

    return {
      data: BookingMapper.toDomains(bookings),
      total,
    };
  }

  async fetchBookingDetails(agencyId: string): Promise<BookingEntity[]> {
    console.log(agencyId, 'agencyId in booking repo');
    const fetchBooking = await this._prisma.booking.findMany({
      where: { agencyId },
      include: {
        package: true,
      },
    });
    console.log(fetchBooking, 'fetchBooking in booking repo');

    return BookingMapper.toDomains(fetchBooking);
  }
  // findByPaymentIntentId(
  //   paymentIntentId: string,
  // ): Promise<BookingEntity | null> {
  //   throw new Error('Method not implemented.');
  // }
  async updateStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<BookingEntity> {
    const updateBooking = await this._prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    return BookingMapper.toDomain(updateBooking);
  }

  async findByPackageId(
    packageId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: BookingEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: Prisma.BookingWhereInput = { packageId };
    if (search) {
      where.user = {
        name: { contains: search, mode: 'insensitive' },
      };
    }

    const [bookings, total] = await Promise.all([
      this._prisma.booking.findMany({
        where,
        include: { user: true, package: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this._prisma.booking.count({ where }),
    ]);

    return {
      data: BookingMapper.tobookingDomains(bookings),
      total,
    };
  }

  async findByAgencyId(agencyId: string): Promise<BookingEntity[]> {
    const bookings = await this._prisma.booking.findMany({
      where: { agencyId },
    });
    return BookingMapper.toDomains(bookings);
  }
  async fetchUserBookingDetails(id: string): Promise<BookingEntity | null> {
    const booking = await this._prisma.booking.findFirst({
      where: { id },
      include: { user: true, package: true },
    });
    if (!booking) return null;
    return BookingMapper.tobookingDomain(booking);
  }

  async countAll(): Promise<number> {
    return await this._prisma.booking.count();
  }
}
