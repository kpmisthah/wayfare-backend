import { Inject, Injectable } from '@nestjs/common';
import { IAdminRepository } from '../../../../domain/repositories/admin/admin.repository.interface';
import { IAdminUsecase } from '../interfaces/admin.usecase.interface';
import { ADMIN_TYPE } from '../../../../domain/types';
import { IAgencyRepository } from '../../../../domain/repositories/agency/agency.repository.interface';
import { AgencyManagementDto } from '../../../dtos/agency-management.dto';
import { AgencyMapper } from '../../mapper/agency.mapper';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { SafeUser } from '../../../dtos/safe-user.dto';
import { UserMapper } from '../../mapper/user.mapper';
import { AgencyStatus } from '../../../../domain/enums/agency-status.enum';

@Injectable()
export class AdminService implements IAdminUsecase {
  constructor(
    @Inject(ADMIN_TYPE.IAdminRepository)
    private readonly _adminRepo: IAdminRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
  ) {}

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

  async updateAgency(
    id: string,
    updateData: { name: string; email: string; status?: string },
  ): Promise<AgencyManagementDto> {
    const agency = await this._agencyRepo.findById(id);
    if (!agency) {
      throw new Error('Agency not found');
    }

    const user = await this._userRepo.findById(agency.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUserEntity = user.update({
      name: updateData.name,
      email: updateData.email,
    });

    await this._userRepo.update(agency.userId, updatedUserEntity);

    const updatedAgency = await this._agencyRepo.findById(id);
    const finalUser = await this._userRepo.findById(agency.userId);

    if (!updatedAgency || !finalUser) {
      throw new Error('Failed to fetch updated data');
    }
    return AgencyMapper.toAgencyManagement(finalUser, updatedAgency);
  }
}
