import { WalletTransferDto } from "src/application/dtos/wallet-tranfer.dto";
import { WalletDto } from "src/application/dtos/wallet.dto";
import { WalletTransactionEntity } from "src/domain/entities/wallet-transaction.entity";
import { WalletEntity } from "src/domain/entities/wallet.entity";

export class WalletMapper {
    static toWalletDto(walletEntity:WalletEntity):WalletDto {
        return{
            id:walletEntity.id,
            userId:walletEntity.userId,
            balance:walletEntity.balance
        }
    }
    static toWalletTransactionDto(walletTransactionEntity:WalletTransactionEntity):WalletTransferDto{
        return{
            id:walletTransactionEntity.id,  
            amount:walletTransactionEntity.amount,
            transactionType:walletTransactionEntity.transactionType,
            paymentStatus:walletTransactionEntity.paymentStatus,
            date:walletTransactionEntity.createdAt
        }
    }
    static toWalletTransactionsDto(walletTransactionEntity:WalletTransactionEntity[]):WalletTransferDto[] {
        return walletTransactionEntity.map((transaction)=>this.toWalletTransactionDto(transaction))
    }
}