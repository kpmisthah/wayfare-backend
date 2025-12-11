import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Optional,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PreferenceDto } from 'src/application/dtos/preferences.dto';
import { IAdminRevenue } from 'src/application/usecases/admin/interfaces/admin-revenue.usecase.interface';
import { IAdminSumaryUsecase } from 'src/application/usecases/admin/interfaces/admin-summary-usecase.interface';
import { IAdminService } from 'src/application/usecases/admin/interfaces/admin.usecase.interface';
import { IAgencyRevenue } from 'src/application/usecases/admin/interfaces/agency-revenue.usecase.interface';
import { IBookingUseCase } from 'src/application/usecases/booking/interfaces/bookiing.usecase.interface';
import { ICreatePayoutRequestUsecase } from 'src/application/usecases/payment/interfaces/create-payout.usecase.interface';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
import { PayoutStatus } from 'src/domain/enums/payout-status.enum';
import { ADMIN_TYPE } from 'src/domain/types';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(
    @Inject(ADMIN_TYPE.IAdminService)
    private readonly _adminUsecase: IAdminService,
    @Inject('IAdminRevenue')
    private readonly _adminRevenue: IAdminRevenue,
    @Inject('IAgencyRevenue')
    private readonly _agencyRevenue: IAgencyRevenue,
    @Inject('IAdminSummaryUsecase')
    private readonly _getAdminSummaryUsecase: IAdminSumaryUsecase,
    @Inject('IBookingUseCase')
    private readonly _bookingUseCase: IBookingUseCase,
    @Inject('ICreatePayoutRequestUsecase')
    private readonly _payoutRequestUsecase: ICreatePayoutRequestUsecase,
  ) {}
  @Get('/preferences')
  getAllPreferences() {
    return this._adminUsecase.getAllPreferences();
  }
  @Post('/preferences')
  createPreference(@Body() preferenceDto: PreferenceDto) {
    return this._adminUsecase.createPreference(preferenceDto);
  }
  @Get('/agencies')
  getAgencies(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: AgencyStatus,
  ) {
    return this._adminUsecase.getAllAgencies({
      page: +page,
      limit: +limit,
      search,
      status,
    });
  }
  @Get('/finance/dashboard')
  async getTotalRevenue(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    const [
      totalRevenue,
      totalCommission,
      walletBalance,
      activeAgencies,
      transactionSummary,
    ] = await Promise.all([
      this._adminRevenue.getTotalRevenue(),
      this._adminRevenue.getAllCommission(),
      this._adminRevenue.getWalletBalance(),
      this._adminRevenue.activeAgencyCount(),
      this._adminRevenue.getTransactionSummary(page, limit, search),
    ]);
    return {
      totalRevenue,
      totalCommission,
      walletBalance,
      activeAgencies,
      transactionSummary,
    };
  }
  @Get('/finance/agency')
  async getAgencyRevenueSummary(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<unknown> {
    return await this._agencyRevenue.getAgencyRevenueSummary(
      page,
      limit,
      search,
    );
  }

  @Get('/summary')
  async getSummary() {
    return this._getAdminSummaryUsecase.getDashboardStats();
  }
  @Get('recent-bookings')
  async getRecentBookings(): Promise<unknown> {
    return await this._bookingUseCase.getRecentBookings();
  }
  @Get('payout-details')
  async payoutDetails(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Optional()
    @Query('status', new ParseEnumPipe(PayoutStatus))
    status?: PayoutStatus,
    @Optional() @Query('search') search?: string,
  ) {
    return await this._payoutRequestUsecase.payoutDetails(
      page,
      limit,
      status,
      search,
    );
  }
  @Patch('/payout/approve/:id')
  async approvePayout(
    @Param('id') id: string,
    @Body('status') status: PayoutStatus,
  ) {
    console.log(status, 'statuss');
    return await this._payoutRequestUsecase.approvePayout(id, status);
  }

  @Patch('/payout/reject/:id')
  async rejectPayout(@Param('id') id: string, @Body('reason') reason: string) {
    return this._payoutRequestUsecase.rejectPayout(id, reason);
  }
}
