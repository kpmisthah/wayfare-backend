import { PayoutDetailsResult } from '../../application/dtos/repository-results';
import { PayoutRequestEntity } from '../entities/payout-request.entity';
import { IBaseRepository } from '../repositories/base.repository';
import { PayoutStatus } from '../enums/payout-status.enum';

export interface IPayoutRequestRepository
  extends IBaseRepository<PayoutRequestEntity> {
  findPendingByAgencyId(agencyId: string): Promise<PayoutRequestEntity[]>;
  payoutDetails(options: {
    skip: number;
    take: number;
    status?: PayoutStatus;
    search?: string;
  }): Promise<PayoutDetailsResult>;
}
