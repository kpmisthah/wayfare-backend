import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { ITravellersUsecase } from '../../application/usecases/travellers/interfaces/travellers.usecase.interface';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../../domain/enums/role.enum';

@Controller('travellers')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.User)
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
    const userId = req.user['userId'];
    return await this._travellersUsecase.fetchTravellers(destination, userId);
  }

  @Get()
  async fetchTravellersByUserDestinations(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this._travellersUsecase.fetchTravellersByUserDestinations(
      userId,
    );
  }
}
