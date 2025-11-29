import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { WalletTransactionEntity } from "src/domain/entities/wallet-transaction.entity";
import { IWalletTransactionRepository } from "src/domain/repositories/wallet/wallet-transaction.repository.interface";
import { PrismaService } from "../../prisma.service";
import { WalletTransactionMapper } from "src/infrastructure/mappers/wallet-transaction.mapper";
import { PaymentStatus } from "src/domain/enums/payment-status.enum";

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
    
    async findAgencyByCredits():Promise<WalletTransactionEntity[]>{
        const transaction = await this._prisma.walletTransaction.findMany({
            where:{status:PaymentStatus.PENDING}
        })
        return transaction.map(txn=>WalletTransactionMapper.toEntity(txn))
    }

    async getWalletSummary(walletId:string){
        let successAmount = await this._prisma.walletTransaction.aggregate({
            where:{
                walletId,
                status:PaymentStatus.SUCCEEDED
            },
            _sum:{amount:true}
        })

        let wholeAmount = await this._prisma.walletTransaction.aggregate({
            where:{walletId},
            _sum:{amount:true}
        })

        let pendingAmount = await this._prisma.walletTransaction.aggregate({
            where:{walletId,status:PaymentStatus.PENDING},
            _sum:{amount:true}
        })
        const walletAmount = successAmount._sum.amount
        const wholeWalletAmount = wholeAmount._sum.amount
        const pendingWalletAmount = pendingAmount._sum.amount
        return {
            walletAmount,
            wholeWalletAmount,
            pendingWalletAmount
        }
    }
}