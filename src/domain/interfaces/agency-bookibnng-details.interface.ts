import { BankingEntity } from '../entities/banking.entity';
import { IBaseRepository } from '../repositories/base.repository';

export interface IBankingDetailsRepository
  extends IBaseRepository<BankingEntity> {
  findByAgencyId(agencyId: string): Promise<BankingEntity | null>;
}
