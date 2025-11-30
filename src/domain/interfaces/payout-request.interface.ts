import { PayoutRequestEntity } from "../entities/payout-request.entity";
import { IBaseRepository } from "../repositories/base.repository";

export interface IPayoutRequestRepository extends IBaseRepository<PayoutRequestEntity>{
  findPendingByAgencyId(agencyId: string): Promise<PayoutRequestEntity[]>;
}
