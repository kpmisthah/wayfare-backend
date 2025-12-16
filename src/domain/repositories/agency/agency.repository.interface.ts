import { AgencyEntity } from '../../entities/agency.entity';
import { IBaseRepository } from '../base.repository';
import { AgencyStatus } from '../../enums/agency-status.enum';
import { AgencyWithUserResult } from '../../../application/dtos/repository-results';

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
  findAlls(
    query: string,
    orderBy: Record<string, unknown> | undefined,
    skip: number,
    limit: number,
  ): Promise<AgencyWithUserResult[] | null>;
  countAll(): Promise<number>;
  findAlll(): Promise<AgencyEntity[] | null>;
}
