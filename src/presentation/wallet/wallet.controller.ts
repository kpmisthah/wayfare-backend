import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { IWalletUseCase } from '../../application/usecases/wallet/interfaces/wallet.usecase.interface';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../../domain/enums/role.enum';

@Controller('wallet')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.User, Role.Agency)
export class WalletController {
  constructor(
    @Inject('IWalletUseCase')
    private readonly _walletUseCase: IWalletUseCase,
  ) {}

  @Get()
  getWallet(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return this._walletUseCase.getWallet(userId);
  }

  @Get('transactions')
  getTransactions(
    @Req() req: RequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user['userId'];
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this._walletUseCase.getTransactions(userId, pageNum, limitNum);
  }
}
