import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';

export interface IAdminRevenueRepository {
  getAllRevenue();
  getAllCommission();
  getWalletBalance();
  activeAgenciesCount();
  getTransactionSummary(): Promise<WalletTransactionEntity[]>;
}
