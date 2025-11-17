// import { Agency, User } from '@prisma/client';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';

import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { AgencyListItem } from 'src/domain/interfaces/agency-list-items.interface';
export interface IAgencyRepository {
  findByEmail(email: string): Promise<AgencyEntity | null>;
  create(agency: AgencyEntity): Promise<AgencyEntity | null>;
  findAll(): Promise<AgencyEntity[] | null> 
  findById(id: string): Promise<AgencyEntity | null>;
  findByUserId(id: string): Promise<AgencyEntity | null>;
  count(): Promise<number>
  findAlls(skip:number, limit:number): Promise<AgencyEntity[] | null>
}
