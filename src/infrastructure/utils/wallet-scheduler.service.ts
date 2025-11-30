import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IWalletPaymentStatus } from 'src/application/usecases/payment/interfaces/wallet-payment-status.usecase.interface';

@Injectable()
export class WalletSchedulerService {
  constructor(
    @Inject('IWalletPaymentStatus')
    private readonly walletStatusService: IWalletPaymentStatus,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyWalletRelease() {
    console.log('⏱ Running daily wallet pending credit release...');
    await this.walletStatusService.releasePendingCredits();
  }
}
