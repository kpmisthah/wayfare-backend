import { AgencyProfileDto } from '../../../dtos/agency-profile.dto';
import { UpdateAgencyProfileDto } from '../../../dtos/update-agency-profile.dto';
export interface IAgencyProfileService {
  updateProfile(
    agencyId,
    updateAgencyProfileDto: UpdateAgencyProfileDto,
  ): Promise<AgencyProfileDto | null>;
  getAgencyProfile(): Promise<AgencyProfileDto[] | null>;
  findProfile(id: string): Promise<AgencyProfileDto | null>;
}
