import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';

export interface TransactionSummaryResult {
  data: WalletTransactionEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IAdminRevenueRepository {
  getAllRevenue(): Promise<number>;
  getAllCommission(): Promise<number>;
  getWalletBalance(): Promise<number | null>;
  activeAgenciesCount(): Promise<number>;
  getTransactionSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<TransactionSummaryResult>;
}
