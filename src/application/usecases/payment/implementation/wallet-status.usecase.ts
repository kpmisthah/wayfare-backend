import { Inject, Injectable } from '@nestjs/common';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository';
import { IWalletTransactionRepository } from '../../../../domain/repositories/wallet/wallet-transaction.repository.interface';
import { IWalletPaymentStatus } from '../interfaces/wallet-payment-status.usecase.interface';

@Injectable()
export class WalletPaymentStatus implements IWalletPaymentStatus {
  constructor(
    @Inject('IWalletTransactionRepo')
    private readonly _walletTransactionRepo: IWalletTransactionRepository,
    @Inject('IBookingRepository')
    private readonly _bookingRepo: IBookingRepository,
  ) {}
  async releasePendingCredits(): Promise<void> {
    const pendingTnx = await this._walletTransactionRepo.findAgencyByCredits();
    for (const txn of pendingTnx) {
      const booking = await this._bookingRepo.findById(txn.bookingId!);
      if (!booking) continue;
      const agencyWalletStatus = booking.getAgencyCreditStatus();
      if (
        txn.paymentStatus == PaymentStatus.PENDING &&
        agencyWalletStatus == PaymentStatus.SUCCEEDED
      ) {
        const updateWalletTransaction = txn.updateWalletTransaction({
          status: PaymentStatus.SUCCEEDED,
        });
        await this._walletTransactionRepo.update(
          txn.id,
          updateWalletTransaction,
        );
      }
      console.log(
        `Auto release: Booking ${booking.id}, credited: ${txn.amount}`,
      );
    }
  }
}
