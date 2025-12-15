import { Inject, Injectable } from '@nestjs/common';

import {
  IAdminRevenue,
  TransactionSummaryResult,
} from '../interfaces/admin-revenue.usecase.interface';
import { IAdminRevenueRepository } from '../../../../domain/repositories/admin/admin-revenue.repository.interface';
import { WalletTransactionMapper } from '../../mapper/wallet-transaction.mapper';

@Injectable()
export class AdminRevenue implements IAdminRevenue {
  constructor(
    @Inject('IAdminRevenueRepository')
    private readonly _adminRevenueRepo: IAdminRevenueRepository,
  ) {}

  async getTotalRevenue(): Promise<number> {
    return await this._adminRevenueRepo.getAllRevenue();
  }

  async getAllCommission(): Promise<number> {
    return await this._adminRevenueRepo.getAllCommission();
  }

  async getWalletBalance(): Promise<number | null> {
    return await this._adminRevenueRepo.getWalletBalance();
  }

  async activeAgencyCount(): Promise<number> {
    return await this._adminRevenueRepo.activeAgenciesCount();
  }

  async getTransactionSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<TransactionSummaryResult> {
    const result = await this._adminRevenueRepo.getTransactionSummary(
      page,
      limit,
      search,
    );

    return {
      data: result.data.map((tr) =>
        WalletTransactionMapper.toWalletTransactionDto(tr),
      ),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    };
  }
}
