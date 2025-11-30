// import { Agency, User } from '@prisma/client';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';

import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { AgencyListItem } from 'src/domain/interfaces/agency-list-items.interface';
import { IBaseRepository } from '../base.repository';
export interface IAgencyRepository extends IBaseRepository<AgencyEntity> {
  findByEmail(email: string): Promise<AgencyEntity | null>;
  create(agency: AgencyEntity): Promise<AgencyEntity | null>;
  findAll(): Promise<AgencyEntity[] | null> 
  findById(id: string): Promise<AgencyEntity | null>;
  findByUserId(id: string): Promise<AgencyEntity | null>;
  count(query: string): Promise<number>
  findAlls(query:string,orderBy:any,skip:number, limit:number) 
  countAll(): Promise<number> 
}
