import { WalletTransferDto } from '../../../dtos/wallet-tranfer.dto';
import { WalletDto } from '../../../dtos/wallet.dto';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { StatusCode } from '../../../../domain/enums/status-code.enum';
import { WalletTransactionEnum } from '../../../../domain/enums/wallet-transaction.enum';

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
  getTransactions(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    data: WalletTransferDto[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  findByUserId(userId: string): Promise<WalletDto | null>;
  getWalletSummary(userId: string): Promise<unknown>;
  getRecentTransaction(userId: string): Promise<unknown>;
  deductAgency(
    agencyId: string,
    deductAmount: number,
    status: PaymentStatus.PENDING | PaymentStatus.SUCCEEDED,
    bookingId: string,
  ): Promise<{ status: StatusCode } | null>;
}
