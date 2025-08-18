import { Inject, Injectable } from '@nestjs/common';
// import { Agency } from '@prisma/client';
import { CreateAgencyDto } from 'src/application/dtos/create-agency.dto';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.service.interface';
import { UpdateAgencyStatusDto } from 'src/application/dtos/update-agency.dto';
import { IOtpService } from 'src/application/usecases/otp/interfaces/otp.service.interface';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
import { AgencyProfile } from 'src/domain/interfaces/agency-profile.interface';
import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { IUserService } from '../../users/interfaces/user.service.interface';
import { AgencyMapper } from '../../mapper/agency.mapper';
import { AgencyResponseDto } from 'src/application/dtos/agency-response.dto';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';

@Injectable()
export class AgencyService implements IAgencyService {
  constructor(
    @Inject('IAgencyRepository')
    private readonly agencyRepo: IAgencyRepository,
    @Inject('IOtpService')
    private readonly emailService: IOtpService,
    @Inject('IUserService')
    private readonly userService:IUserService
  ) {}
  async createAgency(createAgencyDto: CreateAgencyDto):Promise<AgencyResponseDto|null> {
    const existingUser = await this.userService.findByEmail(createAgencyDto.email)
    if(!existingUser) return null
    let agencyEntity = AgencyEntity.create({
      ...createAgencyDto,
      userId:existingUser.id,
      pendingPayouts:0,
      totalEarnings:0,
      transactionId:null
    })
    let agency = await this.agencyRepo.create(agencyEntity);
    if(!agency){
      return null
    }
    return AgencyMapper.toAgencyDto(agency)
  }
  // async agencyApproval(id: string, updateAgencyDto: UpdateAgencyStatusDto) {
  //   const agency = await this.agencyRepo.update(id, updateAgencyDto);
  //   const loginLink = `http://localhost:3000/agency/login?status=${AgencyStatus.ACTIVE}&email=${agency?.user?.email}`;
  //   await this.emailService.agencyVerification(
  //     updateAgencyDto.email!,
  //     loginLink,
  //   );
  //   return agency;
  // }

  async updateProfile(
    id: string,
    updateAgencyStatusDto: UpdateAgencyStatusDto,
  ): Promise<AgencyResponseDto | null> {
    const existingAgency = await this.agencyRepo.findById(id);
    if (!existingAgency) {
      return null;
    }
    const agencyStatusUpdate = existingAgency.updateAgency({
      status:updateAgencyStatusDto.status
    })
    let agency =  await this.agencyRepo.updateStatus(id,agencyStatusUpdate);
    if(!agency) return null
    return AgencyMapper.toAgencyDto(agency)
  }

  async findById(id: string): Promise<AgencyResponseDto | null> {
    let agency = await this.agencyRepo.findById(id)
    if(!agency) return null
    return AgencyMapper.toAgencyDto(agency)
  }
  async findByEmail(email: string): Promise<AgencyEntity | null> {
    let agency = await this.agencyRepo.findByEmail(email);
    if(!agency){
      return null
    }
    return agency
  }
  async findAll(): Promise<AgencyProfileDto[]|null> {
    return this.agencyRepo.findAll();
  }
}
