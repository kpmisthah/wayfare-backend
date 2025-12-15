import { AgencyManagementDto } from '../../../dtos/agency-management.dto';
import { SafeUser } from '../../../dtos/safe-user.dto';
import { AgencyStatus } from '../../../../domain/enums/agency-status.enum';

export interface IAdminService {
  getAllAgencies(dto: {
    page: number;
    limit: number;
    search?: string;
    status?: AgencyStatus;
  }): Promise<{ data: AgencyManagementDto[]; total: number } | null>;
  findAdmin(): Promise<SafeUser | null>;
  updateAgency(
    id: string,
    updateData: { name: string; email: string; status?: string },
  ): Promise<AgencyManagementDto>;
}
