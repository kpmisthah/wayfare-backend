// infrastructure/mappers/payout-request.mapper.ts
import { PayoutRequestEntity } from "src/domain/entities/payout-request.entity";
import { PayoutRequest, Prisma } from "@prisma/client";
import { PayoutStatus } from "src/domain/enums/payout-status.enum";

export class PayoutRequestMapper {
  static toDomain(data: PayoutRequest): PayoutRequestEntity {
    return new PayoutRequestEntity(
      data.id,
      data.agencyId,
      data.amount,
      data.status as PayoutStatus
    );
  }

  static toPrisma(entity: PayoutRequestEntity): Prisma.PayoutRequestCreateInput {
    return {
      agency: { connect: { id: entity.agencyId } },
      amount: entity.amount,
    };
  }

}
