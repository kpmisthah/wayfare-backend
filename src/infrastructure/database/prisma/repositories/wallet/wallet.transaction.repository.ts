import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { WalletTransactionEntity } from "src/domain/entities/wallet-transaction.entity";
import { IWalletTransactionRepository } from "src/domain/repositories/wallet/wallet-transaction.repository.interface";
import { PrismaService } from "../../prisma.service";
import { WalletTransactionMapper } from "src/infrastructure/mappers/wallet-transaction.mapper";

@Injectable()
export class WalletTransactionRepository extends BaseRepository<WalletTransactionEntity> implements IWalletTransactionRepository {
    constructor(private readonly _prisma:PrismaService){
        super(_prisma.walletTransaction,WalletTransactionMapper)
    }
    async getTransactionsByWalletId(walletId: string): Promise<WalletTransactionEntity[]> {
        const transactions = await this._prisma.walletTransaction.findMany({
            where:{
                walletId
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        return transactions.map(txn => WalletTransactionMapper.toEntity(txn));
    }   
}