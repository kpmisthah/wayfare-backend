import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/booking/booking.repository';
import { PaymentProvider } from '../../stripe/interface/payment.interface';
import { RetryPaymentDto } from 'src/application/dtos/retry-payment.dto';
import { ICreateCheckoutSession } from '../interfaces/create-checkout-session.usecase.interface';

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSession {
  constructor(
    @Inject('IBookingRepository')
    private readonly _bookingRepo: IBookingRepository,
    @Inject('IStripeService')
    private readonly _stripeGateway: PaymentProvider,
  ) {}

  async execute(
    command: {
      bookingId?: string;
      successUrl: string;
      cancelUrl: string;
    },
    userId: string,
  ): Promise<{ url: string }> {
    if(!command.bookingId) throw new BadRequestException("Booking id is not defined")
    const booking = await this._bookingRepo.findById(command.bookingId);

    if (!booking || booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    const sessionUrl = await this._stripeGateway.createCheckoutSession({
      amount: booking.totalAmount,
      currency: 'inr',
      metadata: { bookingId: booking.id },
      successUrl: command.successUrl,
      cancelUrl: command.cancelUrl,
      expiresAt: Math.floor((Date.now() + 30 * 60 * 1000) / 1000), // 30 min
    });

    return { url: sessionUrl };
  }
}
