import { PayoutRequestDto } from 'src/application/dtos/payout-request.dto';

export interface ICreatePayoutRequestUsecase {
  execute(dto: PayoutRequestDto): Promise<PayoutRequestDto | null>;
}
