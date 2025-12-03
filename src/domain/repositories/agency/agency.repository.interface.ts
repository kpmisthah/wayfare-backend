import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { IBaseRepository } from '../base.repository';
export interface IAgencyRepository extends IBaseRepository<AgencyEntity> {
  findByEmail(email: string): Promise<AgencyEntity | null>;
  create(agency: AgencyEntity): Promise<AgencyEntity | null>;
  findAll(): Promise<AgencyEntity[] | null>;
  findById(id: string): Promise<AgencyEntity | null>;
  findByUserId(id: string): Promise<AgencyEntity | null>;
  count(query: string): Promise<number>;
  findAlls(query: string, orderBy: any, skip: number, limit: number);
  countAll(): Promise<number>;
}
