import { Inject, Injectable } from '@nestjs/common';
import { CreateAgencyDto } from 'src/application/dtos/create-agency.dto';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.usecase.interface';
import { IOtpService } from 'src/application/usecases/otp/interfaces/otp.usecase.interface';
import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { IUserUsecase } from 'src/application/usecases/users/interfaces/user.usecase.interface';
import { AgencyMapper } from 'src/application/usecases/mapper/agency.mapper';

import { AgencyResponseDto } from 'src/application/dtos/agency-response.dto';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { AgencyManagementDto } from 'src/application/dtos/agency-management.dto';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';
import { IItineraryRepository } from 'src/domain/repositories/agency/itenerary.repository';
import { UserMapper } from '../../mapper/user.mapper';
import { UpdateStatusDto } from 'src/application/dtos/update-status.dto';
import { UserEntity } from 'src/domain/entities/user.entity';

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
    console.log(existingUser, 'existingUser from agency');
    if (!existingUser) return null;
    const agencyEntity = AgencyEntity.create({
      ...createAgencyDto,
      userId: existingUser.id,
      pendingPayouts: 0,
      totalEarnings: 0,
      transactionId: null,
    });
    console.log(agencyEntity, 'agencyEntity');

    const agency = await this._agencyRepo.create(agencyEntity);
    console.log(agency, 'agency');
    // await this._searchService.indexAgency(agency);
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
    console.log(action, 'action in usecase', reason, 'reason in usecase');
    const agencyEntity = await this._agencyRepo.findById(id);
    if (!agencyEntity) return null;
    const userEntity = await this._userRepo.findById(agencyEntity.userId);
    if (!userEntity) return null;
    let updatedUser: UserEntity;
    let updatedAgency: AgencyEntity;
    if (action === 'accept') {
      console.log('reject aakumbo accept l verndo');
      const userUpdate = userEntity.update({ isVerified: true });
      updatedUser = await this._userRepo.update(userUpdate.id, userUpdate);
      updatedAgency = agencyEntity.updateAgency({ reason: null });
      const u = await this._agencyRepo.update(updatedAgency.id, updatedAgency);
      console.log(u, 'updated agency');
    } else {
      console.log('reject aakumbo ivide alle verunne');
      const userUpdate = userEntity.update({ isVerified: false });
      updatedUser = await this._userRepo.update(userUpdate.id, userUpdate);

      updatedAgency = agencyEntity.updateAgency({ reason });
      console.log(updatedAgency, 'updateagency after rejection');
      const v = await this._agencyRepo.update(updatedAgency.id, updatedAgency);
      console.log(v, 'updated agency');
    }
    return AgencyMapper.toAgencyManagement(updatedUser, updatedAgency);
  }

  async findById(id: string): Promise<AgencyProfileDto | null> {
    const agency = await this._agencyRepo.findById(id);
    if (!agency) return null;
    const user = await this._userRepo.findById(agency.userId);
    if (!user) return null;
    return AgencyMapper.toAgencyProfileDto(agency, user);
  }
  async findByEmail(email: string): Promise<AgencyEntity | null> {
    const agency = await this._agencyRepo.findByEmail(email);
    if (!agency) {
      return null;
    }
    return agency;
  }

  async findAll(): Promise<AgencyManagementDto[] | null> {
    const agency = await this._agencyRepo.findAll();
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
    // const users = await this._userRepo.listUsersFromAgencies();
    // if (!users) return null;
    // const filteredUsers = users.filter((user)=>
    //   user.name.toLocaleLowerCase().includes(query?.toLocaleLowerCase()||'')
    // )
    let orderBy;
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
    const mapped = AgencyMapper.toList(agencies);
    console.log(mapped, 'mapped agenciessss');
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
