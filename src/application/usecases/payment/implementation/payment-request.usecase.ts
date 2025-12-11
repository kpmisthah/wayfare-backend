// application/usecases/create-payout-request.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { PayoutRequestDto } from 'src/application/dtos/payout-request.dto';
import { IPayoutRequestRepository } from 'src/domain/interfaces/payout-request.interface';
import { PayoutRequestEntity } from 'src/domain/entities/payout-request.entity';
import { PayoutRequestMapper } from '../../mapper/payout-request.mapper';
import { ICreatePayoutRequestUsecase } from '../interfaces/create-payout.usecase.interface';
import { PayoutDetailsDTO } from 'src/application/dtos/payout-details.dto';
import { PayoutStatus } from 'src/domain/enums/payout-status.enum';
import { StatusCode } from 'src/domain/enums/status-code.enum';
import { ResponseDto } from 'src/application/dtos/reponse.dto';

@Injectable()
export class CreatePayoutRequestUsecase implements ICreatePayoutRequestUsecase {
  constructor(
    @Inject('IPayoutRequestRepository')
    private readonly _payoutRepo: IPayoutRequestRepository,
  ) {}

  async execute(dto: PayoutRequestDto): Promise<PayoutRequestDto | null> {
    const entity = PayoutRequestEntity.create({
      agencyId: dto.agencyId,
      amount: dto.amount,
    });
    console.log(entity, 'enitututut');

    const result = await this._payoutRepo.create(entity);
    console.log(result, 'resulttt');
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
    console.log(payoutRequest, 'payoutreq');
    if (!payoutRequest) return null;
    const updatePayoutRequest = payoutRequest.update({ status });
    console.log(updatePayoutRequest, 'upated');

    const res = await this._payoutRepo.update(
      payoutRequest.id,
      updatePayoutRequest,
    );
    console.log(res, '================>resutlltt===================');

    return {
      code: StatusCode.SUCCESS,
      message: `Payout approved`,
    };
  }

  async rejectPayout(id: string, reason: string): Promise<ResponseDto | null> {
    const payout = await this._payoutRepo.findById(id);
    if (!payout) return null;

    const udpatePayout = payout.update({
      status: PayoutStatus.REJECTED,
      rejectionReason: reason,
    });

    const res = await this._payoutRepo.update(id, udpatePayout);
    console.log(res, 'reason for cancelllattionnnn');

    return {
      code: StatusCode.SUCCESS,
      message: 'Payout rejected',
    };
  }
}
