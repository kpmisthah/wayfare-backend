import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { ITravellersUsecase } from '../../application/usecases/travellers/interfaces/travellers.usecase.interface';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';

@Controller('travellers')
@UseGuards(AccessTokenGuard)
export class TravellersController {
  constructor(
    @Inject('ITravellersUsecase')
    private readonly _travellersUsecase: ITravellersUsecase,
  ) {}

  @Get('same-destination')
  async fetchTravellers(
    @Req() req: RequestWithUser,
    @Query('destination') destination: string,
  ) {
    console.log('Insidee fetchTravelllersss');
    const userId = req.user['userId'];
    const t = await this._travellersUsecase.fetchTravellers(
      destination,
      userId,
    );
    console.log(t, 'from ttt');
    return t;
  }

  @Get()
  async fetchTravellersByUserDestinations(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this._travellersUsecase.fetchTravellersByUserDestinations(
      userId,
    );
  }
}
