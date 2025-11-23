import { CreateBookingDto } from "src/application/dtos/create-booking.dto";
import { BookingEntity } from "src/domain/entities/booking.entity";

export interface IPayment {
    supports(type: string): boolean;
    // payment(booking:CreateBookingDto,agencyId:string):Promise<{ clientSecret?: string }>
    payment(
    booking: BookingEntity,
    agencyId: string
  ): Promise<{
    checkoutUrl?: string;    
    success?: boolean;      
    clientSecret?: string;    
  }>;
}