import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { WalletEntity } from 'src/domain/entities/wallet.entity';
import { PrismaService } from '../../prisma.service';
import { WalletMapper } from 'src/infrastructure/mappers/wallet.mapper';
import { IWalletRepository } from 'src/domain/repositories/wallet/wallet.repository.interface';

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
    console.log(wallet, 'already ino nokaaaanaaa');

    return WalletMapper.toDomain(wallet);
  }
}
