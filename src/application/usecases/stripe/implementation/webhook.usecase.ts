import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentProvider } from '../interface/payment.interface';
import { ITransactionRepository } from 'src/domain/repositories/transaction/transaction.repository';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { IBookingRepository } from 'src/domain/repositories/booking/booking.repository';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';
import { IWalletUseCase } from '../../wallet/interfaces/wallet.usecase.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookUsecase {
  private readonly _logger = new Logger(StripeWebhookUsecase.name);
  constructor(
    @Inject('IStripeService')
    private readonly _paymentProvider: PaymentProvider,
    @Inject('ITransactionRepository')
    private readonly _transactionRepo: ITransactionRepository,
    @Inject('IBookingRepository')
    private readonly _bookingRepo:IBookingRepository,
    @Inject('IWalletUseCase')
    private readonly _walletUseCase:IWalletUseCase
  ) {}
  async handle(rawBody: Buffer, sig: string, secret: string) {
    const event = this._paymentProvider.constructEvent(rawBody, sig, secret);
    if (event.type.startsWith('payment_intent.') || event.type.startsWith('charge.')) {
    this._logger.log(`Ignored legacy event: ${event.type}`);
    return { received: true };
    }
    switch (event.type) {
      case 'checkout.session.completed': {
       const session = event.data.object as Stripe.Checkout.Session;
        // console.log(intent,'intent...................');
        if (session.payment_status !== 'paid') {
          this._logger.warn(`Session completed but not paid: ${session.id}`);
          break;
        }
        // this._logger.log(`Payment succeeded for ${intent.id}`);
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
          this._logger.warn('No bookingId in metadata');
          break;
        }
        const TransactionEntity = await this._transactionRepo.findByBookingId(bookingId)
        if(!TransactionEntity) return null
        const updateTransaction = TransactionEntity.update(
          {
            bookingId:bookingId,
            status:PaymentStatus.SUCCEEDED
          }
        )
    console.log(updateTransaction,'updateTransactino');
    
        const updateTransactionStatus = await this._transactionRepo.update(
          TransactionEntity.id,
          updateTransaction
        );
      console.log(updateTransactionStatus,'updateTransactionStatus');
      
        if(updateTransactionStatus?.status == PaymentStatus.SUCCEEDED){
         let bookingEntity = await this._bookingRepo.findById(updateTransaction.bookingId)
         console.log(bookingEntity,'bookingEntity in stripeWebhook');
         
         if(!bookingEntity)return null
         let updateBooking = bookingEntity.updateBooking({status:BookingStatus.CONFIRMED})
         const u = await this._bookingRepo.update(bookingEntity.id,updateBooking)
         console.log(updateBooking,'updateBooking')
         console.log(u,'uu---')
         //wallet creation for admin
         let agencyWallet = await this._walletUseCase.creditAgency(bookingEntity.agencyId,bookingEntity.agencyEarning)
         console.log(agencyWallet,'agencyWallet in agencyEWsllaer stripe');
      
         let platformWallet = await this._walletUseCase.creditAdmin(bookingEntity.platformEarning)
         console.log(platformWallet,'platform wallet in stripe');
         
        }        
        break;
      }
      case 'checkout.session.expired': {
        console.log("faieeeeeed aayoooooooooooooo")
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
          this._logger.warn('No bookingId in metadata');
          break;
        }
        const TransactionEntity = await this._transactionRepo.findByBookingId(bookingId)
        if(!TransactionEntity) return null
        const updateTransaction = TransactionEntity.update({
          bookingId,
          status:PaymentStatus.FAILED
        })
        await this._transactionRepo.update(
          bookingId,
          updateTransaction
        );
        break;
      }
      default:
        this._logger.log(`Unhandled event type ${event.type}`);
    }
    return {received:true}
  }
}
