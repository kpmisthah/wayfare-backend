import { Inject, Injectable } from '@nestjs/common';
import { preference } from '@prisma/client';
import { PreferenceDto } from 'src/application/dtos/preferences.dto';
import { IAdminRepository } from 'src/domain/repositories/admin/admin.repository.interface';
import { IAdminService } from 'src/application/usecases/admin/interfaces/admin.usecase.interface';
import { ADMIN_TYPE } from 'src/domain/types';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { AgencyManagementDto } from 'src/application/dtos/agency-management.dto';
import { AgencyMapper } from 'src/application/usecases/mapper/agency.mapper';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { SafeUser } from 'src/application/dtos/safe-user.dto';
import { UserMapper } from '../../mapper/user.mapper';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject(ADMIN_TYPE.IAdminRepository)
    private readonly _adminRepo: IAdminRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
  ) {}
  async createPreference(
    preferenceDto: PreferenceDto,
  ): Promise<preference | null> {
    return await this._adminRepo.createPreference(preferenceDto);
  }

  async getAllPreferences(): Promise<preference[] | null> {
    return await this._adminRepo.getAllPreferences();
  }

  async getAllAgencies(): Promise<AgencyManagementDto[] | null> {
    const users = await this._userRepo.findAllAgencies();
    if (!users) return null;
    const agencies = await this._agencyRepo.findAll();
    return AgencyMapper.toListAgencies(users, agencies);
  }
  async findAdmin():Promise<SafeUser|null>{
    const admin = await this._adminRepo.findAdmin()
    if(!admin) return null
    return UserMapper.toSafeUserDto(admin)
  }
}
