import { TransactionEntity } from "src/domain/entities/transaction.entity";
import { IBaseRepository } from "../base.repository";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity|null>{
    findByBookingId(id:string):Promise<TransactionEntity|null>
    getTotalRevenue(): Promise<number>
    getRevenueOverview(): Promise<{month:string,revenue:number,bookings:number}[]> 
    getBookingStatusDistribution(): Promise<{name:string,value:number,color:string}[]> 
}