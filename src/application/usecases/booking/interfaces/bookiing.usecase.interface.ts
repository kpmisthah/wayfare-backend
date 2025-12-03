import { BookingResponseDto } from 'src/application/dtos/booking-details-response.dto';
import { BookingStatusDto } from 'src/application/dtos/booking-status.dto';
import { BookingDto } from 'src/application/dtos/booking.dto';
import { CreateBookingDto } from 'src/application/dtos/create-booking.dto';
import { FetchBookingDto } from 'src/application/dtos/fetch-booking.dto';
import { FetchUserBookingDto } from 'src/application/dtos/fetch-user-booking.dto';
import { BookingEntity } from 'src/domain/entities/booking.entity';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';

export interface IBookingUseCase {
  createBooking(
    createBookingDto: BookingDto,
    userId: string,
  ): Promise<{ booking: CreateBookingDto; checkoutUrl: string } | null>;
  fetchBookings(userId: string): Promise<FetchBookingDto[] | null>;
  getUserBookings(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: (FetchUserBookingDto | undefined)[];
    totalPages: number;
    page: number;
  }>;
  cancelBooking(id: string): Promise<BookingStatusDto | null>;
  updateBookingStatus(
    bookingId: string,
    agencyId: string,
    status: BookingStatus,
  ): Promise<BookingEntity>;

  execute(packageId: string);
  paymentVerification(bookingId: string);
  getUserBookingDetails(id: string): Promise<BookingResponseDto | null>;
  retryPayment(bookingId: string, userId: string): Promise<{ url: string }>;
  getRecentBookings();
}
