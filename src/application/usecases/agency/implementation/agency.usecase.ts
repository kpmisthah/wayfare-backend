import { Inject, Injectable } from '@nestjs/common';
// import { Agency } from '@prisma/client';
import { CreateAgencyDto } from 'src/application/dtos/create-agency.dto';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.usecase.interface';
import { UpdateAgencyStatusDto } from 'src/application/dtos/update-agency.dto';
import { IOtpService } from 'src/application/usecases/otp/interfaces/otp.usecase.interface';
import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { IUserService } from '../../users/interfaces/user.usecase.interface';
import { AgencyMapper } from '../../mapper/agency.mapper';
import { AgencyResponseDto } from 'src/application/dtos/agency-response.dto';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { AgencyManagementDto } from 'src/application/dtos/agency-management.dto';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';

@Injectable()
export class AgencyService implements IAgencyService {
  constructor(
    @Inject('IAgencyRepository')
    private readonly agencyRepo: IAgencyRepository,
    @Inject('IOtpService')
    private readonly emailService: IOtpService,
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IUserRepository')
    private readonly userRepo:IUserRepository
  ) {}

  async createAgency(
    createAgencyDto: CreateAgencyDto,
    userId: string,
  ): Promise<AgencyResponseDto | null> {
    const existingUser = await this.userService.findById(userId);
    console.log(existingUser,'existingUser from agency');
    if (!existingUser) return null; 
      let agencyEntity = AgencyEntity.create({
        ...createAgencyDto,
        userId: existingUser.id,
        pendingPayouts: 0,
        totalEarnings: 0,
        transactionId: null,
      });
      console.log(agencyEntity,'agencyEntity');
      
      let agency = await this.agencyRepo.create(agencyEntity);
      console.log(agency,'agency');
      
      if (!agency) {
        return null;
      }
    return AgencyMapper.toAgencyDto(agency);
  }
  async agencyApproval(agencyDto:AgencyProfileDto):Promise<AgencyManagementDto|null> {
   const agencyEntity = await this.agencyRepo.findById(agencyDto.id)
   console.log(agencyEntity,'agencyEty');
   
    if(!agencyEntity) return null
    const updateUserEntity = await this.userRepo.findById(agencyEntity.userId) 
    console.log(updateUserEntity,'updateuser');
    
    let userUpdate = updateUserEntity?.update({
      isVerified:true
    })
    console.log(userUpdate,'user update id verndo nokknm');
    
    if(!userUpdate)return null
    // let agencyEntity = await this.agencyRepo.findByUserId(userUpdate.id)
    // if(!agencyEntity)return null
    let user = await this.userRepo.update(userUpdate.id,userUpdate)
    // return user
    return AgencyMapper.toAgencyManagement(agencyEntity,user)
  }

  async updateProfile(
    id: string,
    updateAgencyStatusDto: UpdateAgencyStatusDto,
  ): Promise<AgencyResponseDto | null> {
    const existingAgency = await this.agencyRepo.findById(id);
    if (!existingAgency) {
      return null;
    }
    const agencyStatusUpdate = existingAgency.updateAgency({
      status: updateAgencyStatusDto.status,
    });
    let agency = await this.agencyRepo.updateStatus(id, agencyStatusUpdate);
    if (!agency) return null;
    return AgencyMapper.toAgencyDto(agency);
  }

  async findById(id: string): Promise<AgencyResponseDto | null> {
    let agency = await this.agencyRepo.findById(id);
    if (!agency) return null;
    return AgencyMapper.toAgencyDto(agency);
  }
  async findByEmail(email: string): Promise<AgencyEntity | null> {
    let agency = await this.agencyRepo.findByEmail(email);
    if (!agency) {
      return null;
    }
    return agency;
  }
  async findAll(): Promise<AgencyManagementDto[] | null> {
    let agency = await this.agencyRepo.findAll();
    if(!agency) return null
    let user = await this.userRepo.findAll()
    if(!user.data)return null
    return AgencyMapper.toListAgencies(agency,user?.data)
  }

}
