import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { IBaseRepository } from '../base.repository';

export interface IWalletTransactionRepository
  extends IBaseRepository<WalletTransactionEntity> {
  getTransactionsByWalletId(
    walletId: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: unknown[]; total: number; page: number; totalPages: number }>;
  findAgencyByCredits(): Promise<WalletTransactionEntity[]>;
  getWalletSummary(agencyId: string): Promise<unknown>;
  getRecentAgencyWalletTransactions(
    agencyId: string,
    limit: number,
  ): Promise<unknown>;
  findByBookingId(bookingId: string): Promise<WalletTransactionEntity | null>;
}
