import { AgencyManagementDto } from '../../../dtos/agency-management.dto';
import { AgencyProfileDto } from '../../../dtos/agency-profile.dto';
import { AgencyResponseDto } from '../../../dtos/agency-response.dto';
import { CreateAgencyDto } from '../../../dtos/create-agency.dto';
import { UpdateStatusDto } from '../../../dtos/update-status.dto';
import { AgencyEntity } from '../../../../domain/entities/agency.entity';

export interface IAgencyService {

  createAgency(
    createAgencyDto: CreateAgencyDto,
    userId: string,
  ): Promise<AgencyResponseDto | null>;
  findById(id: string): Promise<AgencyProfileDto | null>;
 
  updateStatus(id: string): Promise<UpdateStatusDto | null>;
  findByEmail(email: string): Promise<AgencyEntity | null>;
  findAll(): Promise<AgencyManagementDto[] | null>;
  agencyApproval(
    id: string,
    action: string,
    reason?: string,
  ): Promise<AgencyManagementDto | null>;

  searchAgencies(
    query: string,
    page: number,
    limit: number,
    sortBy: string,
  ): Promise<{
    data: AgencyManagementDto[];
    totalPages: number;
    currentPage: number;
  } | null>;
  getAllAgencies(): Promise<AgencyManagementDto[] | null>;
}
