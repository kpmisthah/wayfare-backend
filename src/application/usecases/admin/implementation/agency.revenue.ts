import { IAgencyRevenueRepository } from 'src/domain/repositories/admin/agency-revenue.repository.interface';
import { IAgencyRevenue } from '../interfaces/agency-revenue.usecase.interface';
import { Inject } from '@nestjs/common';
import { AgencyRevenueDTO } from 'src/application/dtos/agency-revenue.dto';

export class AgencyRevenue implements IAgencyRevenue {
  constructor(
    @Inject('IAgenciesRevenueRepository')
    private readonly _agencyRevenueRepo: IAgencyRevenueRepository,
  ) {}

  async getAgencyRevenueSummary(): Promise<AgencyRevenueDTO[]> {
    return await this._agencyRevenueRepo.getAgencyRevenueSummary();
  }
}
