import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { WalletEntity } from '../../../../../domain/entities/wallet.entity';
import { PrismaService } from '../../prisma.service';
import { WalletMapper } from '../../../../mappers/wallet.mapper';
import { IWalletRepository } from '../../../../../domain/repositories/wallet/wallet.repository.interface';

@Injectable()
export class WalletRepository
  extends BaseRepository<WalletEntity>
  implements IWalletRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.wallet, WalletMapper);
  }
  async findByUserId(userId: string): Promise<WalletEntity> {
    const wallet = await this._prisma.wallet.findFirst({
      where: { userId },
    });

    return WalletMapper.toDomain(wallet);
  }
}
