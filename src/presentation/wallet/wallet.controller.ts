import { Controller, Get, Inject, Req, UseGuards } from "@nestjs/common";
import { RequestWithUser } from "src/application/usecases/auth/interfaces/request-with-user";
import { IWalletUseCase } from "src/application/usecases/wallet/interfaces/wallet.usecase.interface";
import { AccessTokenGuard } from "src/infrastructure/common/guard/accessToken.guard";

@Controller('wallet')
@UseGuards(AccessTokenGuard)
export class WalletController {
    constructor(
        @Inject('IWalletUseCase')
        private readonly _walletUseCase:IWalletUseCase
    ){}

    @Get()
    getWallet(@Req() req:RequestWithUser){
        let userId = req.user['userId']
        return this._walletUseCase.getWallet(userId)
    }
}