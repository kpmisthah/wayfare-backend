// infrastructure/repositories/payout-request.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { IPayoutRequestRepository } from "src/domain/interfaces/payout-request.interface";
import { PayoutRequestEntity } from "src/domain/entities/payout-request.entity";
import { PayoutRequestMapper } from "src/infrastructure/mappers/payout-request.mapper";
import { BaseRepository } from "../base.repository";

@Injectable()
export class PayoutRequestRepository extends BaseRepository<PayoutRequestEntity> implements IPayoutRequestRepository{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.payoutRequest,PayoutRequestMapper)
  }

  async findPendingByAgencyId(agencyId: string) {
    const result = await this._prisma.payoutRequest.findMany({
      where: { agencyId, status: "PENDING" }
    });

    return result.map(PayoutRequestMapper.toDomain);
  }
}
