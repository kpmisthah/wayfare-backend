import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { BankingEntity } from 'src/domain/entities/banking.entity';
import { PrismaService } from '../../prisma.service';
import { AgencyBankDetailsMapper } from 'src/infrastructure/mappers/agency-bank-details.mapper';
import { IBankingDetailsRepository } from 'src/domain/interfaces/agency-bookibnng-details.interface';

@Injectable()
export class AgencyBankDetailsRepository
  extends BaseRepository<BankingEntity>
  implements IBankingDetailsRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.agencyBankDetails, AgencyBankDetailsMapper);
  }
  async findByAgencyId(agencyId: string): Promise<BankingEntity | null> {
    const result = await this._prisma.agencyBankDetails.findFirst({
        where:{agencyId}
    });
    if (!result) return null;

    return AgencyBankDetailsMapper.toDomain(result);
  }
}
