import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { BookingModule } from '../booking/booking.module';
import { WalletPaymentStatus } from 'src/application/usecases/payment/implementation/wallet-status.usecase';
import { ScheduleModule } from '@nestjs/schedule';
import { CreatePayoutRequestUsecase } from 'src/application/usecases/payment/implementation/payment-request.usecase';
@Module({
  imports: [BookingModule, ScheduleModule.forRoot()],
  controllers: [PaymentController],
  providers: [
    {
      provide: 'IWalletPaymentStatus',
      useClass: WalletPaymentStatus,
    },
    {
      provide: 'ICreatePayoutRequestUsecase',
      useClass: CreatePayoutRequestUsecase,
    },
  ],
  exports: ['IWalletPaymentStatus','ICreatePayoutRequestUsecase'],
})
export class PaymentModule {}
