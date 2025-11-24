import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletUsecase } from "src/application/usecases/wallet/implementation/wallet.usecase";
import { WalletPaymentUsecase } from "src/application/usecases/payment/implementation/wallet.payment.usecase";

@Module({
    controllers:[WalletController],
    providers:[
        {
            provide:"IWalletUseCase",
            useClass:WalletUsecase
        }
    ],
    exports:['IWalletUseCase']
})
export class WalletModule {}