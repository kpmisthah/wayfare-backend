import { Inject, Injectable } from '@nestjs/common';
import { UpdateAgencyProfileDto } from 'src/application/dtos/update-agency-profile.dto';
import { IAgencyProfileRepository } from 'src/domain/repositories/agency/agency-profile.repository.interface';
import { IAgencyProfileService } from 'src/application/usecases/agency/interfaces/agency-profile.service.usecase';
import { AGENCY_PROFILE_TYPE } from 'src/domain/types';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';
import { AgencyMapper } from '../../mapper/agency.mapper';

@Injectable()
export class AgencyProfilService implements IAgencyProfileService {
  constructor(
    @Inject(AGENCY_PROFILE_TYPE.IAgencyProfileRepository)
    private readonly agencyProfileRepo: IAgencyProfileRepository,
    // @Inject("IUserService")
    // private readonly userService:IUserService,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IAgencyRepository')
    private readonly agencyRepo: IAgencyRepository,
  ) {}
  async updateProfile(
    agencyId: string,
    updateAgencyProfileDto: UpdateAgencyProfileDto,
  ): Promise<AgencyProfileDto | null> {
    const existingAgency = await this.agencyRepo.findByUserId(agencyId);
    if (!existingAgency) {
      return null;
    }
    const existingUser = await this.userRepo.findById(existingAgency.userId);
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
    console.log(agencyId, 'agencyId');

    const agency = await this.agencyProfileRepo.updateProfile(
      agencyProfileEntity,
      agencyId,
    );
    if (!agency) {
      return null;
    }
    return AgencyMapper.toAgencyProfileDto(agency, existingUser);
  }

  async getAgencyProfile() {
    //cross check with DTO
    return await this.agencyProfileRepo.getAgencyProfile();
  }

  async findProfile(id: string) {
    const user = await this.userRepo.findById(id);
    // if(!user?.isVerified) return null
    if (!user) {
      return null;
    }
    const agency = await this.agencyProfileRepo.findByUserId(id);
    if (!agency) {
      return null;
    }

    return AgencyMapper.toAgencyProfileDto(agency, user);
  }
}
