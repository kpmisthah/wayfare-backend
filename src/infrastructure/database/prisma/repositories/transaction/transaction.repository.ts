import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { TransactionEntity } from "src/domain/entities/transaction.entity";
import { ITransactionRepository } from "src/domain/repositories/transaction/transaction.repository";
import { PrismaService } from "../../prisma.service";
import { TransactionMapper } from "src/infrastructure/mappers/transaction.mapper";

@Injectable()
export class TransactionRepository extends BaseRepository<TransactionEntity> implements ITransactionRepository {
    constructor(private readonly _prisma:PrismaService){
        super(_prisma.transaction,TransactionMapper)
    }
    async findByBookingId(id:string):Promise<TransactionEntity|null>{
        let booking = await this._prisma.transaction.findFirst({
            where:{bookingId:id}
        })
        if(!booking)return null
        return TransactionMapper.toDomain(booking)
    }
}