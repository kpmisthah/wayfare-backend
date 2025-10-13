import { Inject, Injectable } from '@nestjs/common';
import { IPayment } from '../interfaces/payment.interface';
import { PaymentProvider } from '../../stripe/interface/payment.interface';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { Role } from 'src/domain/enums/role.enum';
import { ITransactionRepository } from 'src/domain/repositories/transaction/transaction.repository';
import { CreateBookingDto } from 'src/application/dtos/create-booking.dto';

@Injectable()
export class CardPaymentUsecase implements IPayment {
  constructor(
    @Inject('IStripeService')
    private readonly _paymentProvider: PaymentProvider,
    @Inject('ITransactionRepository')
    private readonly _transactionRepo:ITransactionRepository,    
  ) {}
  
  supports(type: string): boolean {
    return type == 'card'
  }

  async payment(booking:CreateBookingDto,agencyId:string) {
    console.log(booking,'in cardPayment and ',agencyId,'in here');
    
    const clientSecret = await this._paymentProvider.createPaymentIntent(
      booking.totalAmount * 100,
      'inr',
      { bookingId: booking.id },
    );
    console.log(clientSecret,'client sectrrt in cardPaymnetUsecase');
    
    const transactionEntity = TransactionEntity.create({
      bookingId: booking.id,
      agencyId,
      paymentIntentId: clientSecret.split('_secret')[0],
      amount: booking.totalAmount,
      status: PaymentStatus.PENDING,
      currency: 'inr',
      initiatedBy: Role.User,
    });
    console.log(transactionEntity,'rransaction entity in card.payment.usecase');
    
      await this._transactionRepo.create(transactionEntity)
      return{
        clientSecret
      }
  }
}
