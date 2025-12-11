import { AgencyRevenueDTO } from 'src/application/dtos/agency-revenue.dto';

export interface AgencyRevenueSummaryResult {
  data: AgencyRevenueDTO[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IAgencyRevenueRepository {
  getAgencyRevenueSummary(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AgencyRevenueSummaryResult>;
}
