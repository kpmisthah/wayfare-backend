import { WalletTransactionEntity } from "src/domain/entities/wallet-transaction.entity";
import { IBaseRepository } from "../base.repository";

export interface IWalletTransactionRepository extends IBaseRepository<WalletTransactionEntity>{
    
}