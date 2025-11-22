import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { PreferenceDto } from 'src/application/dtos/preferences.dto';
import { IAdminRevenue } from 'src/application/usecases/admin/interfaces/admin-revenue.usecase.interface';
import { IAdminService } from 'src/application/usecases/admin/interfaces/admin.usecase.interface';
import { IAgencyRevenue } from 'src/application/usecases/admin/interfaces/agency-revenue.usecase.interface';
import { ADMIN_TYPE } from 'src/domain/types';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(ADMIN_TYPE.IAdminService)
    private readonly adminService: IAdminService,
    @Inject('IAdminRevenue')
    private readonly _adminRevenue:IAdminRevenue,
    @Inject('IAgencyRevenue')
    private readonly _agencyRevenue:IAgencyRevenue
  ) {}
  @Get('/preferences')
  getAllPreferences() {
    return this.adminService.getAllPreferences();
  }
  @Post('/preferences')
  createPreference(@Body() preferenceDto: PreferenceDto) {
    return this.adminService.createPreference(preferenceDto);
  }
  @Get('/agencies')
  getAgencies() {
    return this.adminService.getAllAgencies();
  }
  @Get('/finance/dashboard')
  async getTotalRevenue(){
    return {
    totalRevenue: await this._adminRevenue.getTotalRevenue(),
    totalCommission: await this._adminRevenue.getAllCommission(),
    walletBalance: await this._adminRevenue.getWalletBalance(),
    activeAgencies: await this._adminRevenue.activeAgencyCount(),
    transactionSummary: await this._adminRevenue.getTransactionSummary(),
    }
  }
  @Get('/finance/agency')
  async getAgencyRevenueSummary(){
    return this._agencyRevenue.getAgencyRevenueSummary()
  }
}
