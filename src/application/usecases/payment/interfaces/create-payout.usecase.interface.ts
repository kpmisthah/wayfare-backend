import { PayoutDetailsDTO } from '../../../dtos/payout-details.dto';
import { PayoutRequestDto } from '../../../dtos/payout-request.dto';
import { ResponseDto } from '../../../dtos/reponse.dto';
import { PayoutStatus } from '../../../../domain/enums/payout-status.enum';

export interface ICreatePayoutRequestUsecase {
  execute(dto: PayoutRequestDto): Promise<PayoutRequestDto | null>;
  payoutDetails(
    page: number,
    limit: number,
    status?: PayoutStatus,
    search?: string,
  ): Promise<{ data: PayoutDetailsDTO[]; total: number }>;
  approvePayout(id: string, status: PayoutStatus): Promise<ResponseDto | null>;
  rejectPayout(id: string, reason: string): Promise<ResponseDto | null>;
}
