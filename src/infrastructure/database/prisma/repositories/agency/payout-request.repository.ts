// infrastructure/repositories/payout-request.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IPayoutRequestRepository } from '../../../../../domain/interfaces/payout-request.interface';
import { PayoutRequestEntity } from '../../../../../domain/entities/payout-request.entity';
import { PayoutRequestMapper } from '../../../../mappers/payout-request.mapper';
import { BaseRepository } from '../base.repository';
import { PayoutDetailsDTO } from '../../../../../application/dtos/payout-details.dto';
import { PayoutStatus } from '../../../../../domain/enums/payout-status.enum';
import { $Enums, Prisma } from '@prisma/client';

@Injectable()
export class PayoutRequestRepository
  extends BaseRepository<PayoutRequestEntity>
  implements IPayoutRequestRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.payoutRequest, PayoutRequestMapper);
  }

  async findPendingByAgencyId(agencyId: string) {
    const result = await this._prisma.payoutRequest.findMany({
      where: { agencyId, status: 'PENDING' },
    });

    return result.map((r) => PayoutRequestMapper.toDomain(r));
  }

  async payoutDetails(options: {
    skip: number;
    take: number;
    status?: PayoutStatus;
    search?: string;
  }): Promise<{ data: PayoutDetailsDTO[]; total: number }> {
    const { skip, take, status, search } = options;

    const where: Prisma.PayoutRequestWhereInput = {};

    if (status) {
      where.status = status as $Enums.PayoutStatus;
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        {
          agency: {
            user: {
              name: { contains: search, mode: 'insensitive' },
              email: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    const total = await this._prisma.payoutRequest.count({ where });

    const result = await this._prisma.payoutRequest.findMany({
      skip: skip,
      take: take,
      where: where,
      include: {
        agency: {
          include: {
            user: true,
            bankDetails: true,
          },
        },
      },
    });

    const data = PayoutRequestMapper.toDtos(result);

    return { data, total };
  }
}
