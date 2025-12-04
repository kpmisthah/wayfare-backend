import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { IBaseRepository } from '../base.repository';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
export interface IAgencyRepository extends IBaseRepository<AgencyEntity> {
  findByEmail(email: string): Promise<AgencyEntity | null>;
  create(agency: AgencyEntity): Promise<AgencyEntity | null>;
  findAll(options: {
    skip: number;
    take: number;
    status?: AgencyStatus;
    search?: string;
  }): Promise<{ data: AgencyEntity[]; total: number } | null>;
  findById(id: string): Promise<AgencyEntity | null>;
  findByUserId(id: string): Promise<AgencyEntity | null>;
  count(query: string): Promise<number>;
  findAlls(query: string, orderBy: any, skip: number, limit: number);
  countAll(): Promise<number>;
  findAlll(): Promise<AgencyEntity[] | null>
}
