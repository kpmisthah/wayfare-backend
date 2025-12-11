import {
  IAgencyRevenueRepository,
  AgencyRevenueSummaryResult,
} from 'src/domain/repositories/admin/agency-revenue.repository.interface';
import { IAgencyRevenue } from '../interfaces/agency-revenue.usecase.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AgencyRevenue implements IAgencyRevenue {
  constructor(
    @Inject('IAgenciesRevenueRepository')
    private readonly _agencyRevenueRepo: IAgencyRevenueRepository,
  ) {}

  async getAgencyRevenueSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AgencyRevenueSummaryResult> {
    return await this._agencyRevenueRepo.getAgencyRevenueSummary(
      page,
      limit,
      search,
    );
  }
}
