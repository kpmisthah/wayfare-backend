import { Inject, Injectable } from '@nestjs/common';
import { UpdateAgencyProfileDto } from '../../../dtos/update-agency-profile.dto';
import { IAgencyProfileRepository } from '../../../../domain/repositories/agency/agency-profile.repository.interface';
import { IAgencyProfileService } from '../interfaces/agency-profile.service.usecase';
import { AGENCY_PROFILE_TYPE } from '../../../../domain/types';
import { IAgencyRepository } from '../../../../domain/repositories/agency/agency.repository.interface';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { AgencyProfileDto } from '../../../dtos/agency-profile.dto';
import { AgencyMapper } from '../../mapper/agency.mapper';

@Injectable()
export class AgencyProfilService implements IAgencyProfileService {
  constructor(
    @Inject(AGENCY_PROFILE_TYPE.IAgencyProfileRepository)
    private readonly _agencyProfileRepo: IAgencyProfileRepository,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
  ) {}
  async updateProfile(
    agencyId: string,
    updateAgencyProfileDto: UpdateAgencyProfileDto,
  ): Promise<AgencyProfileDto | null> {
    const existingAgency = await this._agencyRepo.findByUserId(agencyId);
    if (!existingAgency) {
      return null;
    }
    const existingUser = await this._userRepo.findById(existingAgency.userId);
    if (!existingUser) {
      return null;
    }
    existingUser.update(existingUser);
    const agencyProfileEntity = existingAgency.updateAgencyProfile(
      updateAgencyProfileDto,
    );
    if (!agencyProfileEntity) {
      return null;
    }
    const agency = await this._agencyProfileRepo.updateProfile(
      agencyProfileEntity,
      agencyId,
    );
    if (!agency) {
      return null;
    }
    return AgencyMapper.toAgencyProfileDto(agency, existingUser);
  }

  async getAgencyProfile(): Promise<AgencyProfileDto[] | null> {
    const agencies = await this._agencyProfileRepo.getAgencyProfile();
    if (!agencies) return null;

    const result: AgencyProfileDto[] = [];
    for (const agency of agencies) {
      const user = await this._userRepo.findById(agency.userId);
      if (user) {
        result.push(AgencyMapper.toAgencyProfileDto(agency, user));
      }
    }
    return result;
  }

  async findProfile(id: string) {
    const user = await this._userRepo.findById(id);
    if (!user) {
      return null;
    }
    const agency = await this._agencyProfileRepo.findByUserId(id);
    if (!agency) {
      return null;
    }

    return AgencyMapper.toAgencyProfileDto(agency, user);
  }
}
