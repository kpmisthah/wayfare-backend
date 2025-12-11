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
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';

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

  async getAllAgencies(dto: {
    page: number;
    limit: number;
    search?: string;
    status?: AgencyStatus;
  }): Promise<{ data: AgencyManagementDto[]; total: number } | null> {
    const { page, limit, search, status } = dto;
    const skip = (page - 1) * limit;
    const take = limit;
    const users = await this._userRepo.findAllAgencies();
    if (!users) return null;
    const agencies = await this._agencyRepo.findAll({
      skip,
      take,
      status,
      search,
    });
    if (!agencies) return null;
    const data = AgencyMapper.toListAgencies(users, agencies.data);
    return { data, total: agencies.total };
  }
  async findAdmin(): Promise<SafeUser | null> {
    const admin = await this._adminRepo.findAdmin();
    if (!admin) return null;
    return UserMapper.toSafeUserDto(admin);
  }
}
