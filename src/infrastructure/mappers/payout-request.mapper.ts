// infrastructure/mappers/payout-request.mapper.ts
import { PayoutRequestEntity } from 'src/domain/entities/payout-request.entity';
import { PayoutRequest, Prisma } from '@prisma/client';
import { PayoutStatus } from 'src/domain/enums/payout-status.enum';
import { PayoutDetailsDTO } from 'src/application/dtos/payout-details.dto';

type PayoutPrismaResult = Prisma.PayoutRequestGetPayload<{
  include: {
    agency: {
      include: {
        user: true;
        bankDetails: true;
      }
    }
  }
}>

export class PayoutRequestMapper {
  static toDomain(data: PayoutRequest): PayoutRequestEntity {
    return new PayoutRequestEntity(
      data.id,
      data.agencyId,
      data.amount,
      data.status as PayoutStatus,
      data.rejectionReason ?? ''
    );
  }

  static toPrisma(
    entity: PayoutRequestEntity,
  ): Prisma.PayoutRequestCreateInput {
    return {
      agency: { connect: { id: entity.agencyId } },
      amount: entity.amount,
      status:entity.status,
      rejectionReason:entity.rejectionReason
    };
  }

  static toDto(result:PayoutPrismaResult):PayoutDetailsDTO{
    return{
    id: result.id,
    amount: result.amount,
    status: result.status as PayoutStatus,

    agencyInfo: {
      name: result.agency.user.name,
      phone: result.agency.user.phone ?? '',
      email: result.agency.user.email,
    },

    bankDetails: {
      bankName: result.agency.bankDetails?.bankName ?? '',
      accountNumber: result.agency.bankDetails?.accountNumber ?? '',
      branch: result.agency.bankDetails?.branch ?? '',
      ifscCode: result.agency.bankDetails?.ifscCode ?? '',
    }
  }
}

static toDtos(results:PayoutPrismaResult[]):PayoutDetailsDTO[]{
  return results.map((result)=>this.toDto(result))
}
  
}
