import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { WalletModule } from "../wallet/wallet.module";
import { CardPaymentUsecase } from "src/application/usecases/payment/implementation/card.payment.usecase";
import { WalletPaymentUsecase } from "src/application/usecases/payment/implementation/wallet.payment.usecase";
import { PaymentRegistry } from "src/application/usecases/payment/implementation/payment.registry";
import { BookingUseCase } from "src/application/usecases/booking/implementation/booking.usecase";


@Module({
    imports: [WalletModule],
    controllers: [BookingController],
    providers: [
        CardPaymentUsecase,
        WalletPaymentUsecase,
        PaymentRegistry,
        {
            provide: "IBookingUseCase",
            useClass: BookingUseCase,
        },
    ],
    exports: ["IBookingUseCase"],
})
export class BookingModule {}
