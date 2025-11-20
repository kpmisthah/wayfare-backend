import { AgencyManagementDto } from 'src/application/dtos/agency-management.dto';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';
import { AgencyResponseDto } from 'src/application/dtos/agency-response.dto';
import { CreateAgencyDto } from 'src/application/dtos/create-agency.dto';
import { UpdateStatusDto } from 'src/application/dtos/update-status.dto';
import { AgencyEntity } from 'src/domain/entities/agency.entity';

export interface IAgencyService {
  // agencyApproval(id: string, updateAgencyDto: UpdateAgencyStatusDto): Promise<any>;
  createAgency(
    createAgencyDto: CreateAgencyDto,
    userId: string,
  ): Promise<AgencyResponseDto | null>;
  findById(id: string): Promise<AgencyProfileDto | null>;
  // updateProfile(
  //   id: string,
  //   updateAgencyStatusDto: UpdateAgencyStatusDto,
  // ): Promise<AgencyResponseDto | null>;
  updateStatus(id: string): Promise<UpdateStatusDto | null>;
  findByEmail(email: string): Promise<AgencyEntity | null>;
  findAll(): Promise<AgencyManagementDto[] | null>;
  agencyApproval(id: string,action:string,reason?:string): Promise<AgencyManagementDto | null>
  // listAgencies(page:number,limit:number): Promise<{data:AgencyManagementDto[],totalPages:number,currentPage:number} | null> 
  searchAgencies(query:string,page:number,limit:number,sortBy:string): Promise<{data:AgencyManagementDto[],totalPages:number,currentPage:number} | null>
  
}
