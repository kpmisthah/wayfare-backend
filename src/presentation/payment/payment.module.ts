import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { BookingModule } from "../booking/booking.module";

@Module({
    imports:[BookingModule],
    controllers:[PaymentController]
})

export class PaymentModule {}