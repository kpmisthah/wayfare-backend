import { PayoutRequestDto } from 'src/application/dtos/payout-request.dto';
import { PayoutRequestEntity } from 'src/domain/entities/payout-request.entity';

export class PayoutRequestMapper {
  static toDto(entity: PayoutRequestEntity): PayoutRequestDto {
    return {
      id: entity.id,
      agencyId: entity.agencyId,
      amount: entity.amount,
      status: entity.status,
    };
  }
}
