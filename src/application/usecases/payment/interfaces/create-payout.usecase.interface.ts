import { PayoutDetailsDTO } from 'src/application/dtos/payout-details.dto';
import { PayoutRequestDto } from 'src/application/dtos/payout-request.dto';
import { ResponseDto } from 'src/application/dtos/reponse.dto';
import { PayoutStatus } from 'src/domain/enums/payout-status.enum';

export interface ICreatePayoutRequestUsecase {
  execute(dto: PayoutRequestDto): Promise<PayoutRequestDto | null>;
  payoutDetails(
    page: number,
    limit: number,
    status?: PayoutStatus,
    search?: string,
  ): Promise<{ data: PayoutDetailsDTO[]; total: number }> 
  approvePayout(id:string,status:PayoutStatus):Promise<ResponseDto|null>
  rejectPayout(id: string, reason: string):Promise<ResponseDto|null>
}
