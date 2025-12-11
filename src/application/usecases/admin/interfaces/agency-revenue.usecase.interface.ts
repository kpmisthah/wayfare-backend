import { AgencyRevenueSummaryResult } from 'src/domain/repositories/admin/agency-revenue.repository.interface';

export interface IAgencyRevenue {
  getAgencyRevenueSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AgencyRevenueSummaryResult>;
}
