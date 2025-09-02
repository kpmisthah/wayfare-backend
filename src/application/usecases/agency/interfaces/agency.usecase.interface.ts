import { AgencyManagementDto } from 'src/application/dtos/agency-management.dto';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';
import { AgencyResponseDto } from 'src/application/dtos/agency-response.dto';
import { CreateAgencyDto } from 'src/application/dtos/create-agency.dto';
import {  UpdateAgencyStatusDto } from 'src/application/dtos/update-agency.dto';
import { AgencyEntity } from 'src/domain/entities/agency.entity';


export interface IAgencyService {
  // agencyApproval(id: string, updateAgencyDto: UpdateAgencyStatusDto): Promise<any>;
  createAgency(
    createAgencyDto: CreateAgencyDto,
    userId: string,
  ): Promise<AgencyResponseDto | null> 
  findById(id: string): Promise<AgencyResponseDto | null>;
  updateProfile(
      id: string,
      updateAgencyStatusDto: UpdateAgencyStatusDto): Promise<AgencyResponseDto | null> 
  findByEmail(email: string): Promise<AgencyEntity | null> 
  findAll(): Promise<AgencyManagementDto[] | null>
  agencyApproval(agencyDto:AgencyProfileDto):Promise<AgencyManagementDto|null>
  }