// application/usecases/create-payout-request.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { PayoutRequestDto } from 'src/application/dtos/payout-request.dto';
import { IPayoutRequestRepository } from 'src/domain/interfaces/payout-request.interface';
import { PayoutRequestEntity } from 'src/domain/entities/payout-request.entity';
import { PayoutRequestMapper } from '../../mapper/payout-request.mapper';
import { ICreatePayoutRequestUsecase } from '../interfaces/create-payout.usecase.interface';

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
}
