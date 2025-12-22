import { Inject, Injectable } from '@nestjs/common';
import { CreateAgencyDto } from '../../../dtos/create-agency.dto';
import { IAgencyRepository } from '../../../../domain/repositories/agency/agency.repository.interface';
import { IAgencyService } from '../interfaces/agency.usecase.interface';
import { IOtpService } from '../../otp/interfaces/otp.usecase.interface';
import { AgencyEntity } from '../../../../domain/entities/agency.entity';
import { IUserUsecase } from '../../users/interfaces/user.usecase.interface';
import { AgencyMapper } from '../../mapper/agency.mapper';

import { AgencyResponseDto } from '../../../dtos/agency-response.dto';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { AgencyManagementDto } from '../../../dtos/agency-management.dto';
import { AgencyProfileDto } from '../../../dtos/agency-profile.dto';
import { IItineraryRepository } from '../../../../domain/repositories/agency/itenerary.repository';
import { UserMapper } from '../../mapper/user.mapper';
import { UpdateStatusDto } from '../../../dtos/update-status.dto';
import { UserEntity } from '../../../../domain/entities/user.entity';

@Injectable()
export class AgencyService implements IAgencyService {
  constructor(
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
    @Inject('IOtpService')
    private readonly _emailService: IOtpService,
    @Inject('IUserService')
    private readonly _userService: IUserUsecase,
    @Inject('IUserRepository') 
    private readonly _userRepo: IUserRepository,
    @Inject('IIteneraryRepository')
    private readonly _IteneraryRepo: IItineraryRepository,
    // private readonly _searchService:SearchService
  ) {}

  async createAgency(
    createAgencyDto: CreateAgencyDto,
    userId: string,
  ): Promise<AgencyResponseDto | null> {
    const existingUser = await this._userService.findById(userId);
    if (!existingUser) return null;
    const agencyEntity = AgencyEntity.create({
      ...createAgencyDto,
      userId: existingUser.id,
      pendingPayouts: 0,
      totalEarnings: 0,
      transactionId: null,
    });
    const agency = await this._agencyRepo.create(agencyEntity);
    if (!agency) {
      return null;
    }
    return AgencyMapper.toAgencyDto(agency);
  }
  async agencyApproval(
    id: string,
    action: 'accept' | 'reject',
    reason?: string,
  ): Promise<AgencyManagementDto | null> {
    const agencyEntity = await this._agencyRepo.findById(id);
    if (!agencyEntity) return null;
    const userEntity = await this._userRepo.findById(agencyEntity.userId);
    if (!userEntity) return null;
    let updatedUser: UserEntity;
    let updatedAgency: AgencyEntity;
    if (action === 'accept') {
      const userUpdate = userEntity.update({ isVerified: true });
      updatedUser = await this._userRepo.update(userUpdate.id, userUpdate);
      updatedAgency = agencyEntity.updateAgency({ reason: null });
      const u = await this._agencyRepo.update(updatedAgency.id, updatedAgency);
    } else {
      const userUpdate = userEntity.update({ isVerified: false });
      updatedUser = await this._userRepo.update(userUpdate.id, userUpdate);

      updatedAgency = agencyEntity.updateAgency({ reason });
      const v = await this._agencyRepo.update(updatedAgency.id, updatedAgency);
    }
    return AgencyMapper.toAgencyManagement(updatedUser, updatedAgency);
  }
  async getAllAgencies(): Promise<AgencyManagementDto[] | null> {
    const users = await this._userRepo.findAllAgencies();
    if (!users) return null;
    const agencies = await this._agencyRepo.findAlll();
    return AgencyMapper.toListAgencies(users, agencies);
  }
  async findById(id: string): Promise<AgencyProfileDto | null> {
    const agency = await this._agencyRepo.findById(id);
    if (!agency) return null;
    const user = await this._userRepo.findById(agency.userId);
    if (!user) return null;
    return AgencyMapper.toAgencyProfileDto(agency, user);
  }
  async findByEmail(email: string) {
    const agency = await this._agencyRepo.findByEmail(email);
    if (!agency) {
      return null;
    }
    return AgencyMapper.toAgencyInternalDto(agency);
  }

  async findAll(): Promise<AgencyManagementDto[] | null> {
    const agency = await this._agencyRepo.findAlll();
    if (!agency) return null;
    const user = await this._userRepo.findAll();
    if (!user.data) return null;
    return AgencyMapper.toListAgencies(user?.data, agency);
  }
  async searchAgencies(
    query: string,
    page: number,
    limit: number,
    sortBy: string,
  ): Promise<{
    data: AgencyManagementDto[];
    totalPages: number;
    currentPage: number;
  } | null> {
    const skip = (page - 1) * limit;
    let orderBy: Record<string, unknown> | undefined = undefined;
    if (sortBy === 'az') {
      orderBy = { user: { name: 'asc' } };
    }
    if (sortBy === 'za') {
      orderBy = { user: { name: 'desc' } };
    }
    if (sortBy === 'packages') {
      orderBy = { package: { _count: 'desc' } };
    }
    const [agencies, total] = await Promise.all([
      this._agencyRepo.findAlls(query, orderBy, skip, limit),
      this._agencyRepo.count(query),
    ]);
    if (!agencies) {
      return { data: [], totalPages: 0, currentPage: page };
    }
    const mapped = agencies.map((agency) => ({
      id: agency.domain.id,
      address: agency.domain.address ?? '',
      licenseNumber: agency.domain.licenseNumber ?? '',
      ownerName: agency.domain.ownerName ?? '',
      websiteUrl: agency.domain.websiteUrl ?? '',
      description: agency.domain.description ?? '',
      user: {
        name: agency.user.name,
        email: agency.user.email,
        isVerified: agency.user.isVerified,
        image: agency.user.profileImage,
        isBlock: agency.user.isBlock,
      },
    }));
    return {
      data: mapped,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
  async updateStatus(id: string): Promise<UpdateStatusDto | null> {
    const agency = await this._agencyRepo.findById(id);
    if (!agency) return null;
    const user = await this._userRepo.findById(agency.userId);
    if (!user) return null;
    const updateUserEntity = user.updateUserStatus({ isBlock: !user.isBlock });

    const updateUser = await this._userRepo.updateStatus(
      user.id,
      updateUserEntity.isBlock,
    );
    if (!updateUser) return null;
    return UserMapper.toUpdateStatus(updateUser);
  }
}
