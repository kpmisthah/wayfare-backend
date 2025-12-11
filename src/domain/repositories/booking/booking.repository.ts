import { BookingEntity } from 'src/domain/entities/booking.entity';
import { IBaseRepository } from '../base.repository';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';

export interface IBookingRepository
  extends IBaseRepository<BookingEntity | null> {
  findByUserId(
    userId: string,
    options?: {
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: BookingEntity[]; total: number }>;
  fetchBookingDetails(agencyId: string): Promise<BookingEntity[]>;
  updateStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<BookingEntity>;
  findByPackageId(
    packageId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: BookingEntity[]; total: number }>;
  fetchUserBookingDetails(id: string): Promise<BookingEntity | null>;
  findByAgencyId(agencyId: string): Promise<BookingEntity[]>;
  countAll(): Promise<number>;
}
