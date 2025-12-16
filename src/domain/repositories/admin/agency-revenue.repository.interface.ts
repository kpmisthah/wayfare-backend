import { AgencyRevenueSummaryResult } from '../../../application/dtos/repository-results';

export interface IAgencyRevenueRepository {
  getAgencyRevenueSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AgencyRevenueSummaryResult>;
}
