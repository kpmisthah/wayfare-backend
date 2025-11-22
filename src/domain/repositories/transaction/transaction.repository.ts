import { TransactionEntity } from "src/domain/entities/transaction.entity";
import { IBaseRepository } from "../base.repository";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity|null>{
    findByBookingId(id:string):Promise<TransactionEntity|null>
    findByPaymentIntent(paymentIntentId:string):Promise<TransactionEntity|null>
}