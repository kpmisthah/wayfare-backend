import { AgencyDashboardData } from '../../../../domain/repositories/agency/agency-dashboard.repository.interface';

export interface IAgencyDashboardUseCase {
  execute(userId: string): Promise<AgencyDashboardData>;
}
