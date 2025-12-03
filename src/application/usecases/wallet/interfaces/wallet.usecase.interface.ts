import { WalletTransferDto } from 'src/application/dtos/wallet-tranfer.dto';
import { WalletDto } from 'src/application/dtos/wallet.dto';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { WalletTransactionEnum } from 'src/domain/enums/wallet-transaction.enum';

export interface IWalletUseCase {
  createWallet(balance: number, userId: string): Promise<WalletDto>;
  addBalance(
    balance: number,
    userId: string,
    category: WalletTransactionEnum,
    bookingId: string,
    paymentStatus: PaymentStatus,
  ): Promise<WalletDto | null>;
  getWallet(userId: string): Promise<WalletDto | null>;
  creditAgency(
    agencyId: string,
    earning: number,
    status: PaymentStatus.PENDING | PaymentStatus.SUCCEEDED,
    bookingId: string,
  ): Promise<WalletDto | null>;
  creditAdmin(earning: number, bookingId: string): Promise<WalletDto | null>;
  getTransactions(userId: string): Promise<WalletTransferDto[]>;
  findByUserId(userId: string): Promise<WalletDto | null>;
  getWalletSummary(userId: string);
  getRecentTransaction(userId: string);
}
