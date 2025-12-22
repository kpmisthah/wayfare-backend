import { BookingResponseDto } from '../../dtos/booking-details-response.dto';
import { BookingStatusDto } from '../../dtos/booking-status.dto';
import { CreateBookingDto } from '../../dtos/create-booking.dto';
import { FetchBookingDto } from '../../dtos/fetch-booking.dto';
import { FetchUserBookingDto } from '../../dtos/fetch-user-booking.dto';
import { ResponseBookingDto } from '../../dtos/response-booking.dto';
import { AgencyEntity } from '../../../domain/entities/agency.entity';
import { BookingEntity } from '../../../domain/entities/booking.entity';
import { PackageEntity } from '../../../domain/entities/package.entity';
import { UserEntity } from '../../../domain/entities/user.entity';

export class BookingMapper {
  static toBookDto(bookingEntity: BookingEntity): CreateBookingDto {
    return {
      id: bookingEntity.id,
      packageId: bookingEntity.packageId,
      travelDate: bookingEntity.travelDate,
      peopleCount: bookingEntity.peopleCount,
      totalAmount: bookingEntity.totalAmount,
    };
  }

  static toFetchBookingDto(
    bookingEntity: BookingEntity,
    user: UserEntity,
    travelPackage: PackageEntity,
  ): FetchBookingDto {
    return {
      id: bookingEntity.id,
      customer: user.name,
      destination: travelPackage.destination,
      date: bookingEntity.travelDate,
      budget: bookingEntity.totalAmount,
      status: bookingEntity.status,
    };
  }
  static toFetchBookingsDto(
    bookingEntity: BookingEntity[],
    userEntity: (UserEntity | null)[],
    packageEntity: (PackageEntity | null)[],
  ): FetchBookingDto[] {
    const filteredUser = userEntity.filter((user) => user != null);
    const user = filteredUser.find((user) =>
      bookingEntity.find((booking) => user.id == booking.userId),
    );
    if (!user) throw new Error('User not found');
    const filteredPackage = packageEntity.filter((pkg) => pkg != null);
    const travelPackage = filteredPackage.find((pkg) =>
      bookingEntity.find((booking) => booking.packageId == pkg.id),
    );
    if (!travelPackage) throw new Error('Package not found');
    return bookingEntity.map((booking) => {
      return BookingMapper.toFetchBookingDto(booking, user, travelPackage);
    });
  }

  static toFetchUserBookingDto(
    bookingEntity: BookingEntity,
    packageEntity: PackageEntity,
    userEntity: UserEntity | undefined,
  ): FetchUserBookingDto {
    return {
      id: bookingEntity.id,
      destination: packageEntity.destination,
      agencyName: userEntity?.name,
      travellers: bookingEntity.peopleCount,
      price: bookingEntity.totalAmount,
      photo: packageEntity.picture,
      bookingStatus: bookingEntity.status,
      highlights: packageEntity.highlights,
      travelDate: bookingEntity.travelDate,
      bookingCode: bookingEntity.bookingCode.toString(),
    };
  }
  static toFetchUserBookingsDto(
    bookingEntity: BookingEntity[],
    packageEntity: (PackageEntity | undefined)[],
    agencyUsers: UserEntity[],
    agencyEntity: AgencyEntity[],
  ): (FetchUserBookingDto | undefined)[] {
    return bookingEntity.map((booking) => {
      const pkgEntity = packageEntity.find((pkg) => {
        if (pkg) {
          return pkg.id == booking.packageId;
        }
      });

      if (!pkgEntity) return;

      const userEntity = agencyUsers.find((user) =>
        agencyEntity.find((agency) => agency.userId == user.id),
      );

      return BookingMapper.toFetchUserBookingDto(
        booking,
        pkgEntity,
        userEntity,
      );
    });
  }

  static toUpdateBookingStatus(bookingEntity: BookingEntity): BookingStatusDto {
    return {
      bookingStatus: bookingEntity.status,
    };
  }
  static toResponseBookingDto(
    bookingEntity: BookingEntity,
  ): ResponseBookingDto {
    return {
      id: bookingEntity.id,
      customerName: bookingEntity.customerName ?? '',
      status: bookingEntity.status,
      email: bookingEntity.customerEmail ?? '',
      phone: bookingEntity.phone,
      totalPeople: bookingEntity.peopleCount,
      totalAmount: bookingEntity.totalAmount,
      destination: bookingEntity.destination ?? '',
      travelDate: bookingEntity.travelDate,
    };
  }
  static toResponseBookingDtoByPackageId(
    bookingEntity: BookingEntity[],
  ): ResponseBookingDto[] {
    return bookingEntity.map((booking) => {
      return BookingMapper.toResponseBookingDto(booking);
    });
  }

  static toBookingResponseDto(
    bookingEntity: BookingEntity,
  ): BookingResponseDto {
    return {
      id: bookingEntity.id,
      startDate: bookingEntity.travelDate,
      duration: bookingEntity.duration ?? 0,
      title: bookingEntity.title ?? '',
      destination: bookingEntity.destination ?? '',
      travelers: bookingEntity.peopleCount,
      totalAmount: bookingEntity.totalAmount,
      email: bookingEntity.customerEmail ?? '',
      bookingCode: bookingEntity.bookingCode.toString(),
    };
  }
}
