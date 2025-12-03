import { Prisma, Wallet } from '@prisma/client';
import { WalletEntity } from 'src/domain/entities/wallet.entity';

export class WalletMapper {
  static toDomain(wallet: Wallet | null): WalletEntity {
    return new WalletEntity(
      wallet?.id ?? '',
      wallet?.userId ?? '',
      wallet?.balance ?? 0,
    );
  }
  static toPrisma(wallet: WalletEntity): Prisma.WalletCreateInput {
    return {
      user: { connect: { id: wallet.userId } },
      balance: wallet.balance,
    };
  }
}
