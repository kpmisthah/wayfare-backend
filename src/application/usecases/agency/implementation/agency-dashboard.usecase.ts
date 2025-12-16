import { Inject, Injectable } from '@nestjs/common';
import { IAgencyDashboardUseCase } from '../interfaces/agency-dashboard.usecase.interface';
import {
  AgencyDashboardData,
  IAgencyDashboardRepository,
} from '../../../../domain/repositories/agency/agency-dashboard.repository.interface';

@Injectable()
export class AgencyDashboardUseCase implements IAgencyDashboardUseCase {
  constructor(
    @Inject('IAgencyDashboardRepository')
    private readonly _agencyDashboardRepository: IAgencyDashboardRepository,
  ) {}

  async execute(userId: string): Promise<AgencyDashboardData> {
    return this._agencyDashboardRepository.getDashboardData(userId);
  }
}
