import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { PreferenceDto } from 'src/application/dtos/preferences.dto';
import { IAdminRevenue } from 'src/application/usecases/admin/interfaces/admin-revenue.usecase.interface';
import { IAdminSumaryUsecase } from 'src/application/usecases/admin/interfaces/admin-summary-usecase.interface';
import { IAdminService } from 'src/application/usecases/admin/interfaces/admin.usecase.interface';
import { IAgencyRevenue } from 'src/application/usecases/admin/interfaces/agency-revenue.usecase.interface';
import { IBookingUseCase } from 'src/application/usecases/booking/interfaces/bookiing.usecase.interface';
import { ADMIN_TYPE } from 'src/domain/types';

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
  getAgencies() {
    return this._adminUsecase.getAllAgencies();
  }
  @Get('/finance/dashboard')
  async getTotalRevenue() {
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
      this._adminRevenue.getTransactionSummary(),
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
  async getAgencyRevenueSummary() {
    return this._agencyRevenue.getAgencyRevenueSummary();
  }

  @Get('/summary')
  async getSummary() {
    return this._getAdminSummaryUsecase.getDashboardStats();
  }
  @Get('recent-bookings')
  async getRecentBookings() {
    return await this._bookingUseCase.getRecentBookings();
  }
}
