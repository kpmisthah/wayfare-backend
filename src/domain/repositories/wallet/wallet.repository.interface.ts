import { WalletEntity } from '../../entities/wallet.entity';
import { IBaseRepository } from '../base.repository';

export interface IWalletRepository extends IBaseRepository<WalletEntity> {
  findByUserId(userId: string): Promise<WalletEntity>;
}
