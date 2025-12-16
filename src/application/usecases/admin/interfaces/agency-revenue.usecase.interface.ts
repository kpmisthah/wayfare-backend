import { AgencyRevenueSummaryResult } from '../../../dtos/repository-results';

export interface IAgencyRevenue {
  getAgencyRevenueSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AgencyRevenueSummaryResult>;
}
