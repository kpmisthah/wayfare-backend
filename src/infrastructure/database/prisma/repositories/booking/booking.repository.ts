import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { BookingEntity } from 'src/domain/entities/booking.entity';
import { IBookingRepository } from 'src/domain/repositories/booking/booking.repository';
import { BookingMapper } from 'src/infrastructure/mappers/booking.mapper';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';

@Injectable()
export class BookingRepository
  extends BaseRepository<BookingEntity>
  implements IBookingRepository
{
  constructor(private _prisma: PrismaService) {
    super(_prisma.booking, BookingMapper);
  }
  async findByUserId(userId: string): Promise<BookingEntity[] | null> {
    let booking = await this._prisma.booking.findMany({
      where: { userId },
    });
    if (!booking) return null;
    return BookingMapper.toDomains(booking);
  }

  async fetchBookingDetails(agencyId: string): Promise<BookingEntity[]> {
    console.log(agencyId, 'agencyId in booking repo');
    let fetchBooking = await this._prisma.booking.findMany({
      where: { agencyId },
      include:{
        package:true
      }
    });
    console.log(fetchBooking, 'fetchBooking in booking repo');

    return BookingMapper.toDomains(fetchBooking);
  }
  findByPaymentIntentId(
    paymentIntentId: string,
  ): Promise<BookingEntity | null> {
    throw new Error('Method not implemented.');
  }
  async updateStatus(bookingId: string, status: BookingStatus):Promise<BookingEntity> {
    const updateBooking = await this._prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    return BookingMapper.toDomain(updateBooking)
  }

  //customer name
  //customer email
  //phone number
  //people count
  //totalamount
  async findByPackageId(packageId:string):Promise<BookingEntity[]>{
   let bookings = await this._prisma.booking.findMany({
      where:{packageId},
      include:{user:true}
    })
    return BookingMapper.tobookingDomains(bookings)
  }
}
