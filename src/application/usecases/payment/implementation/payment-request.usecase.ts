// application/usecases/create-payout-request.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { PayoutRequestDto } from '../../../dtos/payout-request.dto';
import { IPayoutRequestRepository } from '../../../../domain/interfaces/payout-request.interface';
import { PayoutRequestEntity } from '../../../../domain/entities/payout-request.entity';
import { PayoutRequestMapper } from '../../mapper/payout-request.mapper';
import { ICreatePayoutRequestUsecase } from '../interfaces/create-payout.usecase.interface';
import { PayoutDetailsDTO } from '../../../dtos/payout-details.dto';
import { PayoutStatus } from '../../../../domain/enums/payout-status.enum';
import { StatusCode } from '../../../../domain/enums/status-code.enum';
import { ResponseDto } from '../../../dtos/reponse.dto';
import { IWalletUseCase } from '../../wallet/interfaces/wallet.usecase.interface';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';

@Injectable()
export class CreatePayoutRequestUsecase implements ICreatePayoutRequestUsecase {
  constructor(
    @Inject('IPayoutRequestRepository')
    private readonly _payoutRepo: IPayoutRequestRepository,
    @Inject('IWalletUseCase')
    private readonly _walletUseCase: IWalletUseCase,
  ) { }

  async execute(dto: PayoutRequestDto): Promise<PayoutRequestDto | null> {
    const entity = PayoutRequestEntity.create({
      agencyId: dto.agencyId,
      amount: dto.amount,
    });

    const result = await this._payoutRepo.create(entity);
    if (!result) return null;
    return PayoutRequestMapper.toDto(result);
  }
  async payoutDetails(
    page: number,
    limit: number,
    status?: PayoutStatus,
    search?: string,
  ): Promise<{ data: PayoutDetailsDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const take = limit;
    return await this._payoutRepo.payoutDetails({ skip, take, status, search });
  }

  async approvePayout(
    id: string,
    status: PayoutStatus,
  ): Promise<ResponseDto | null> {
    const payoutRequest = await this._payoutRepo.findById(id);
    if (!payoutRequest) return null;

    if (status === PayoutStatus.APPROVED) {
      const deductResult = await this._walletUseCase.deductAgency(
        payoutRequest.agencyId,
        payoutRequest.amount,
        PaymentStatus.SUCCEEDED,
        payoutRequest.id,
      );

      if (!deductResult || deductResult.status !== StatusCode.SUCCESS) {
        throw new Error('Failed to deduct amount from agency wallet');
      }
    }

    const updatePayoutRequest = payoutRequest.update({ status });

    await this._payoutRepo.update(payoutRequest.id, updatePayoutRequest);

    return {
      code: StatusCode.SUCCESS,
      message: `Payout ${status === PayoutStatus.APPROVED ? 'approved and amount deducted from wallet' : 'approved'}`,
    };
  }

  async rejectPayout(id: string, reason: string): Promise<ResponseDto | null> {
    const payout = await this._payoutRepo.findById(id);
    if (!payout) return null;

    const udpatePayout = payout.update({
      status: PayoutStatus.REJECTED,
      rejectionReason: reason,
    });

    await this._payoutRepo.update(id, udpatePayout);

    return {
      code: StatusCode.SUCCESS,
      message: 'Payout rejected',
    };
  }
}
