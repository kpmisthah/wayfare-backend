import { preference } from '@prisma/client';
import { AgencyManagementDto } from 'src/application/dtos/agency-management.dto';
import { PreferenceDto } from 'src/application/dtos/preferences.dto';
import { SafeUser } from 'src/application/dtos/safe-user.dto';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';

export interface IAdminService {
  createPreference(preferenceDto: PreferenceDto): Promise<preference | null>;
  getAllPreferences(): Promise<preference[] | null>;
  getAllAgencies(dto: {
      page: number;
      limit: number;
      search?: string;
      status?: AgencyStatus;
    }): Promise<{data:AgencyManagementDto[];total:number} | null> 
  findAdmin(): Promise<SafeUser | null>;
}