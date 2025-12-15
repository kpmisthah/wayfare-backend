import { WalletTransactionDto } from '../../../dtos/wallet-transaction.dto';

export interface TransactionSummaryResult {
  data: WalletTransactionDto[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IAdminRevenue {
  getTotalRevenue(): Promise<number>;
  getAllCommission(): Promise<number>;
  getWalletBalance(): Promise<number | null>;
  activeAgencyCount(): Promise<number>;
  getTransactionSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<TransactionSummaryResult>;
}
