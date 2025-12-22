import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GenerateTripDto } from '../../application/dtos/generate-trip.dto';
import { TripDto } from '../../application/dtos/Trip.dto';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { IAiTripPlanUsecase } from '../../application/usecases/trip/interafaces/ai-trip-plan.usecase.interface';
import { IGenerateAndSaveTrip } from '../../application/usecases/trip/interafaces/generate-and-save-trip.usecase.interface';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../../domain/enums/role.enum';

@Controller('trip')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.User)
export class TripController {
  constructor(
    @Inject('IGenerateAndSaveTrip')
    private readonly _generateAndSaveTrip: IGenerateAndSaveTrip,
    @Inject('IAiTripPlanUsecase')
    private readonly _tripPlan: IAiTripPlanUsecase,
  ) {}

  @Post('generate')
  async generateTripPlan(
    @Req() req: RequestWithUser,
    @Body() dto: GenerateTripDto,
  ): Promise<TripDto> {
    const userId = req.user.userId;
    return await this._generateAndSaveTrip.execute(userId, dto);
  }
  @Get('/:id/:destination')
  async fetchTrip(@Param('id') id: string) {
    return await this._tripPlan.fetchTripPlan(id);
  }

  @Get()
  async fetchAllTrip(
    @Req() req: RequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const userId = req.user.userId;
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;

    return await this._tripPlan.fetchAllTrip(userId, {
      page: pageNum,
      limit: limitNum,
      search: search || '',
    });
  }
}
