import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentProvider } from '../interface/payment.interface';
import { ITransactionRepository } from 'src/domain/repositories/transaction/transaction.repository';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { IBookingRepository } from 'src/domain/repositories/booking/booking.repository';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';
import { IWalletUseCase } from '../../wallet/interfaces/wallet.usecase.interface';

@Injectable()
export class StripeWebhookUsecase {
  private readonly _logger = new Logger(StripeWebhookUsecase.name);

  constructor(
    @Inject('IStripeService')
    private readonly _paymentProvider: PaymentProvider,
    @Inject('ITransactionRepository')
    private readonly _transactionRepo: ITransactionRepository,
    @Inject('IBookingRepository')
    private readonly _bookingRepo: IBookingRepository,
    @Inject('IWalletUseCase')
    private readonly _walletUseCase: IWalletUseCase,
  ) {}

  async handle(rawBody: Buffer, sig: string, secret: string) {
    const event = this._paymentProvider.constructEvent(rawBody, sig, secret);

    // Ignore legacy Stripe events
    if (
      event.type.startsWith('payment_intent.') ||
      event.type.startsWith('charge.')
    ) {
      this._logger.log(`Ignored legacy event: ${event.type}`);
      return { received: true };
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        if (session.payment_status !== 'paid') {
          this._logger.warn(`Session completed but not paid`, {
            sessionId: session.id,
          });
          break;
        }

        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
          this._logger.warn('Checkout completed but no bookingId in metadata');
          break;
        }

        this._logger.log('Payment successful - Processing booking', {
          bookingId,
          sessionId: session.id,
        });

        const TransactionEntity =
          await this._transactionRepo.findByBookingId(bookingId);
        if (!TransactionEntity) {
          this._logger.error('Transaction not found for booking', {
            bookingId,
          });
          return null;
        }

        const updateTransaction = TransactionEntity.update({
          bookingId: bookingId,
          status: PaymentStatus.SUCCEEDED,
        });

        const updateTransactionStatus = await this._transactionRepo.update(
          TransactionEntity.id,
          updateTransaction,
        );

        if (updateTransactionStatus?.status == PaymentStatus.SUCCEEDED) {
          const bookingEntity = await this._bookingRepo.findById(
            updateTransaction.bookingId,
          );

          if (!bookingEntity) {
            this._logger.error('Booking not found after payment success', {
              bookingId,
            });
            return null;
          }

          const updateBooking = bookingEntity.updateBooking({
            status: BookingStatus.CONFIRMED,
          });

          const updatedBooking = await this._bookingRepo.update(
            bookingEntity.id,
            updateBooking,
          );
          if (!updatedBooking) {
            this._logger.error('Failed to update booking status', {
              bookingId,
            });
            return null;
          }

          this._logger.log('Booking confirmed', {
            bookingId,
            status: BookingStatus.CONFIRMED,
          });

          // Credit agency wallet
          const agencyWalletStatus = bookingEntity.getAgencyCreditStatus();
          await this._walletUseCase.creditAgency(
            bookingEntity.agencyId,
            bookingEntity.agencyEarning,
            agencyWalletStatus,
            bookingEntity.id,
          );
          this._logger.log('Agency credited', {
            agencyId: bookingEntity.agencyId,
            amount: bookingEntity.agencyEarning,
          });

          // Credit platform wallet
          await this._walletUseCase.creditAdmin(
            bookingEntity.platformEarning,
            bookingEntity.id,
          );
          this._logger.log('Platform credited', {
            amount: bookingEntity.platformEarning,
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        this._logger.warn('Checkout session expired', {
          sessionId: session.id,
          bookingId,
        });

        if (!bookingId) {
          this._logger.warn('No bookingId in expired session metadata');
          break;
        }

        const TransactionEntity =
          await this._transactionRepo.findByBookingId(bookingId);
        if (!TransactionEntity) return null;

        const updateTransaction = TransactionEntity.update({
          bookingId,
          status: PaymentStatus.FAILED,
        });
        await this._transactionRepo.update(
          TransactionEntity.id,
          updateTransaction,
        );
        this._logger.log('Transaction marked as failed', {
          bookingId,
          transactionId: TransactionEntity.id,
        });
        break;
      }

      default:
        this._logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
