import { Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../../../dtos/create-booking.dto';
import { IWalletTransactionRepository } from '../../../../domain/repositories/wallet/wallet-transaction.repository.interface';
import { WalletTransactionEntity } from '../../../../domain/entities/wallet-transaction.entity';
import { IAgencyRepository } from '../../../../domain/repositories/agency/agency.repository.interface';
import { IWalletRepository } from '../../../../domain/repositories/wallet/wallet.repository.interface';
import { Transaction } from '../../../../domain/enums/transaction.enum';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { IPayment } from '../interfaces/payment.interface';
import { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository';
import { BookingStatus } from '../../../../domain/enums/booking-status.enum';
import { IWalletUseCase } from '../../wallet/interfaces/wallet.usecase.interface';
import { WalletEntity } from '../../../../domain/entities/wallet.entity';
import { WalletTransactionEnum } from '../../../../domain/enums/wallet-transaction.enum';

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
    const bookingEntity = await this._bookingRepo.findById(booking.id);
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
      if (!createWallet) throw new Error('Failed to create wallet');
      wallet = createWallet;
    }
    const updateWallet = wallet.debit(booking.totalAmount);
    console.log(updateWallet, 'updateWallet heee');
    const c = await this._walletRepo.update(wallet.id, updateWallet);
    console.log(c, 'walletrepo update');

    const walletTransactionEntity = WalletTransactionEntity.create({
      walletId: wallet.id,
      amount: booking.totalAmount,
      transactionType: Transaction.Debit,
      paymentStatus: PaymentStatus.SUCCEEDED,
      category: WalletTransactionEnum.USER_PAYMENT,
      createdAt: new Date(),
      bookingId: booking.id,
      agencyId,
    });
    const updatedBooking = bookingEntity.updateBooking({
      status: BookingStatus.CONFIRMED,
    });
    await this._bookingRepo.update(bookingEntity.id, updatedBooking);

    const w = await this._walletTransactionRepo.create(walletTransactionEntity);
    console.log(w, 'walletTransaction Entity');
    const agencyWalletStatus = bookingEntity.getAgencyCreditStatus();
    const d = await this._walletUseCase.creditAgency(
      agencyId,
      bookingEntity.agencyEarning,
      agencyWalletStatus,
      bookingEntity.id,
    );
    console.log(d, 'credit agency in wallet paymebt');

    const z = await this._walletUseCase.creditAdmin(
      bookingEntity.platformEarning,
      bookingEntity.id,
    );
    console.log(z, 'credit admin in walllet paybment');

    return {};
  }
}
