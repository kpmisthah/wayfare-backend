import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { IBaseRepository } from '../base.repository';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
import { AgencyManageDto } from 'src/application/dtos/AgencyManagement.dto';

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
  ): Promise<AgencyManageDto[] | null>;
  countAll(): Promise<number>;
  findAlll(): Promise<AgencyEntity[] | null>;
}
