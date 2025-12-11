import { PayoutDetailsDTO } from 'src/application/dtos/payout-details.dto';
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
  }): Promise<{ data: PayoutDetailsDTO[]; total: number }>;
}
