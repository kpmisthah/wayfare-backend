import { preference } from '@prisma/client';
import { AgencyManagementDto } from 'src/application/dtos/agency-management.dto';
import { PreferenceDto } from 'src/application/dtos/preferences.dto';
import { SafeUser } from 'src/application/dtos/safe-user.dto';

export interface IAdminService {
  createPreference(preferenceDto: PreferenceDto): Promise<preference | null>;
  getAllPreferences(): Promise<preference[] | null>;
  getAllAgencies(): Promise<AgencyManagementDto[] | null>;
  findAdmin():Promise<SafeUser|null>
}
