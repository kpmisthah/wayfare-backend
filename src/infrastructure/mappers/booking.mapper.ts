import { $Enums, Booking, Prisma } from '@prisma/client';
import { BookingEntity } from 'src/domain/entities/booking.entity';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';
import { BookingCode } from 'src/domain/value-objects/booking.code';

type BookingWithUser = Prisma.BookingGetPayload<{
  include: { user: true; package: true };
}>;
export class BookingMapper {
  static toDomain(booking: Booking): BookingEntity {
    return new BookingEntity(
      booking.id,
      booking.packageId,
      booking.userId,
      booking.peopleCount,
      booking.totalAmount,
      booking.isCancellationAllowed,
      booking.status as BookingStatus,
      booking.travelDate,
      booking.agencyId,
      booking.commissionRate,
      booking.platformEarning,
      booking.agencyEarning,
      BookingCode.fromString(booking.bookingCode)
    );
  }

  static toPrisma(booking: BookingEntity): Prisma.BookingCreateInput {
    return {
      package: { connect: { id: booking.packageId } },
      user: { connect: { id: booking.userId } },
      agency: { connect: { id: booking.agencyId } },
      travelDate: booking.travelDate,
      peopleCount: booking.peopleCount,
      totalAmount: booking.totalAmount,
      isCancellationAllowed: booking.isCancellation,
      status: booking.status as $Enums.BookingStatus,
      connectiongroupId: '',
      commissionRate: booking.commission,
      platformEarning: booking.platformEarning,
      agencyEarning: booking.agencyEarning,
      bookingCode:booking.bookingCode.toString()
    };
  }

  static toDomains(booking: Booking[]): BookingEntity[] {
    return booking.map((booking) => {
      return BookingMapper.toDomain(booking);
    });
  }

  static tobookingDomain(booking: BookingWithUser) {
    return new BookingEntity(
      booking.id,
      booking.packageId,
      booking.userId,
      booking.peopleCount,
      booking.totalAmount,
      booking.isCancellationAllowed,
      booking.status as BookingStatus,
      booking.travelDate,
      booking.agencyId,
      booking.commissionRate,
      booking.platformEarning,
      booking.agencyEarning,
      BookingCode.fromString(booking.bookingCode),
      booking.user.name,
      booking.user.email,
      booking.user.phone ?? '',
      booking.package.destination ?? '',
      booking.package.itineraryName ?? '',
      booking.package.duration ?? 0,
    );
  }

  static tobookingDomains(booking: BookingWithUser[]): BookingEntity[] {
    return booking.map((booking) => {
      return BookingMapper.tobookingDomain(booking);
    });
  }
}
