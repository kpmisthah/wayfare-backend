import { Injectable } from "@nestjs/common";
import { IBookingRepository } from "src/domain/repositories/booking/booking.repository";
import { PaymentProvider } from "../../stripe/interface/payment.interface";
import { BookingStatus } from "@prisma/client";

@Injectable()
export class ConfirmBookingUsecase {
    constructor(
        private readonly _bookingRepo:IBookingRepository,

    ){}
    async execute(amount:number,currency:string){
        // let userId;
        // const clientSecret = await this._paymentProvider.createPaymentIntent(amount,currency)
        // const bookingEntity = await this._bookingRepo.findByUserId(userId)
    }

}