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
import { GenerateTripDto } from 'src/application/dtos/generate-trip.dto';
import { TripDto } from 'src/application/dtos/Trip.dto';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { IAiTripPlanUsecase } from 'src/application/usecases/trip/interafaces/ai-trip-plan.usecase.interface';
import { IGenerateAndSaveTrip } from 'src/application/usecases/trip/interafaces/generate-and-save-trip.usecase.interface';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';

@Controller('trip')
@UseGuards(AccessTokenGuard, RolesGuard) // Added RolesGuard
@Roles(Role.User) // Only Users can access trip planning
export class TripController {
  constructor(
    @Inject('IGenerateAndSaveTrip')
    private readonly _generateAndSaveTrip: IGenerateAndSaveTrip,
    @Inject('IAiTripPlanUsecase')
    private readonly _tripPlan: IAiTripPlanUsecase,
  ) { }

  @Post('generate')
  async generateTripPlan(
    @Req() req: RequestWithUser,
    @Body() dto: GenerateTripDto,
  ): Promise<TripDto> {
    const userId = req.user.userId;
    console.log(dto, 'dto in controlllerrrrrr trip controlllerrr');
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
