import { BookingEntity } from "src/domain/entities/booking.entity";
import { IBaseRepository } from "../base.repository";
import { BookingStatus } from "src/domain/enums/booking-status.enum";

export interface IBookingRepository extends IBaseRepository<BookingEntity|null>{
    findByUserId(userId:string):Promise<BookingEntity[]|null>
    findByPaymentIntentId(paymentIntentId: string): Promise<BookingEntity | null>;
    fetchBookingDetails(agencyId:string):Promise<BookingEntity[]>
    updateStatus(bookingId: string, status: BookingStatus):Promise<BookingEntity>
    findByPackageId(packageId:string):Promise<BookingEntity[]>
    fetchUserBookingDetails(id:string):Promise<BookingEntity|null>
    findByAgencyId(agencyId:string):Promise<BookingEntity[]>
    countAll(): Promise<number> 


}