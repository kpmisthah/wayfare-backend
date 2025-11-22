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
    private readonly _bookingRepo:IBookingRepository,
    @Inject('IWalletUseCase')
    private readonly _walletUseCase:IWalletUseCase
  ) {}
  async handle(rawBody: Buffer, sig: string, secret: string) {
    const event = this._paymentProvider.constructEvent(rawBody, sig, secret);
    
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as any;
        console.log(intent,'intent...................');
        
        this._logger.log(`Payment succeeded for ${intent.id}`);
        const TransactionEntity = await this._transactionRepo.findByBookingId(intent.metadata.bookingId)
        if(!TransactionEntity) return null
        const updateTransaction = TransactionEntity.update(
          {
            bookingId:intent.metadata.bookingId,
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
      case 'payment_intent.payment_failed': {
        console.log("faieeeeeed aayoooooooooooooo")
        const intent = event.data.object as any;
        this._logger.warn(`Payment failed for ${intent.id}`);
        const TransactionEntity = await this._transactionRepo.findByBookingId(intent.metadata.bookingId)
        if(!TransactionEntity) return null
        const updateTransaction = TransactionEntity.update({
          bookingId:intent.metadata.bookingId,
          status:PaymentStatus.FAILED
        })
        await this._transactionRepo.update(
          intent.metadata.bookingId,
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
