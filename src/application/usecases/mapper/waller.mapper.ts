import { WalletDto } from "src/application/dtos/wallet.dto";
import { WalletEntity } from "src/domain/entities/wallet.entity";

export class WalletMapper {
    static toWalletDto(walletEntity:WalletEntity):WalletDto {
        return{
            id:walletEntity.id,
            userId:walletEntity.userId,
            balance:walletEntity.balance
        }
    }
}