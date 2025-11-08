import { Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from 'src/application/dtos/create-booking.dto';
import { IWalletTransactionRepository } from 'src/domain/repositories/wallet/wallet-transaction.repository.interface';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet.repository.interface';
import { Transaction } from 'src/domain/enums/transaction.enum';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { IPayment } from '../interfaces/payment.interface';
import { IBookingRepository } from 'src/domain/repositories/booking/booking.repository';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';
import { IWalletUseCase } from '../../wallet/interfaces/wallet.usecase.interface';
import { WalletEntity } from 'src/domain/entities/wallet.entity';
import { WalletTransactionEnum } from 'src/domain/enums/wallet-transaction.enum';

@Injectable()
export class WalletPaymentUsecase implements IPayment {
  constructor(
    @Inject('IWalletTransactionRepo')
    private readonly _walletTransactionRepo: IWalletTransactionRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
    @Inject('IWalletRepository')
    private readonly _walletRepo: IWalletRepository,
    @Inject('IBookingRepository')
    private readonly _bookingRepo: IBookingRepository,
    @Inject('IWalletUseCase')
    private readonly _walletUseCase: IWalletUseCase,
  ) {}
  supports(type: string): boolean {
    return type == 'wallet';
  }

  async payment(booking: CreateBookingDto, agencyId: string) {
    let bookingEntity = await this._bookingRepo.findById(booking.id);
    console.log(booking, 'booking');

    if (!bookingEntity) throw new Error('Bookings  not found');
    let wallet = await this._walletRepo.findByUserId(bookingEntity.userId);
    console.log(wallet, 'wallettt');

    if (!wallet) {
      const newWallet = WalletEntity.create({
        userId: bookingEntity.userId,
        balance: 0,
      });

      const createWallet = await this._walletRepo.create(newWallet);
      if(!createWallet) throw new Error("Failed to create wallet")
        wallet = createWallet
    }
    let updateWallet = wallet.debit(booking.totalAmount);
    console.log(updateWallet,'updateWallet heee');
    let c = await this._walletRepo.update(wallet.id, updateWallet);
    console.log(c,'walletrepo update');
    
    const walletTransactionEntity = WalletTransactionEntity.create({
      walletId: wallet.id,
      amount: booking.totalAmount,
      transactionType: Transaction.Debit,
      paymentStatus: PaymentStatus.SUCCEEDED,
      category:WalletTransactionEnum.USER_PAYMENT,
      createdAt:new Date(),
      bookingId: booking.id,
      agencyId,
    });
    const updatedBooking = bookingEntity.updateBooking({
      status: BookingStatus.CONFIRMED,
    });
    await this._bookingRepo.update(bookingEntity.id, updatedBooking);

    let w = await this._walletTransactionRepo.create(walletTransactionEntity);
    console.log(w,'walletTransaction Entity');
    
    let d = await this._walletUseCase.creditAgency(
      agencyId,
      bookingEntity.agencyEarning,
    );
    console.log(d,'credit agency in wallet paymebt');
    
    let z = await this._walletUseCase.creditAdmin(bookingEntity.platformEarning);
    console.log(z,'credit admin in walllet paybment');
    
    return {};
  }
}
