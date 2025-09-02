// import { Agency, User } from '@prisma/client';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';
import { UpdateAgencyStatusDto } from 'src/application/dtos/update-agency.dto';
import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { AgencyListItem } from 'src/domain/interfaces/agency-list-items.interface';
export interface IAgencyRepository {
    updateStatus(
    id: string,
    updateAgencyStatus:UpdateAgencyStatusDto,
  ): Promise<AgencyEntity | null> 
  findByEmail(email: string): Promise<AgencyEntity | null>; 
  create(agency:AgencyEntity): Promise<AgencyEntity | null>
  findAll(): Promise<AgencyEntity[] | null>
  findById(id: string): Promise<AgencyEntity | null>;
  findByUserId(id:string):Promise<AgencyEntity|null>
}
