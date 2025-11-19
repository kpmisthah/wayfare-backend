import { WalletTransferDto } from "src/application/dtos/wallet-tranfer.dto";
import { WalletDto } from "src/application/dtos/wallet.dto";
import { WalletTransactionEnum } from "src/domain/enums/wallet-transaction.enum";

export interface IWalletUseCase{
    createWallet(balance:number,userId:string):Promise<WalletDto>
    addBalance(balance: number, userId: string,category:WalletTransactionEnum): Promise<WalletDto | null>
    getWallet(userId:string):Promise<WalletDto|null> 
    creditAgency(agencyId:string,earning:number):Promise<WalletDto|null>
    creditAdmin(earning:number):Promise<WalletDto|null>
    getTransactions(userId: string): Promise<WalletTransferDto[]> 
    findByUserId(userId: string): Promise<WalletDto | null>
}