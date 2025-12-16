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
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CsvService,
  ExportColumn,
} from '../../infrastructure/utils/csv.service';
import { IUserUsecase } from '../../application/usecases/users/interfaces/user.usecase.interface';
import { SafeUser } from '../../application/dtos/safe-user.dto';
import { PayoutDetailsDTO } from '../../application/dtos/payout-details.dto';
import { WalletTransactionDto } from '../../application/dtos/wallet-transaction.dto';
import { AgencyRevenueDTO } from '../../application/dtos/agency-revenue.dto';
import { IAdminRevenue } from '../../application/usecases/admin/interfaces/admin-revenue.usecase.interface';
import { IAdminSumaryUsecase } from '../../application/usecases/admin/interfaces/admin-summary-usecase.interface';
import { IAdminUsecase } from '../../application/usecases/admin/interfaces/admin.usecase.interface';
import { IAgencyRevenue } from '../../application/usecases/admin/interfaces/agency-revenue.usecase.interface';
import { IBookingUseCase } from '../../application/usecases/booking/interfaces/bookiing.usecase.interface';
import { ICreatePayoutRequestUsecase } from '../../application/usecases/payment/interfaces/create-payout.usecase.interface';
import { AgencyStatus } from '../../domain/enums/agency-status.enum';
import { PayoutStatus } from '../../domain/enums/payout-status.enum';
import { ADMIN_TYPE } from '../../domain/types';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../../domain/enums/role.enum';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(
    @Inject(ADMIN_TYPE.IAdminService)
    private readonly _adminUsecase: IAdminUsecase,
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
    private readonly _csvService: CsvService,
    @Inject('IUserService')
    private readonly _userService: IUserUsecase,
  ) {}
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

  @Patch('/agency/:id')
  async updateAgency(
    @Param('id') id: string,
    @Body() updateData: { name: string; email: string; status?: string },
  ) {
    return await this._adminUsecase.updateAgency(id, updateData);
  }

  @Get('/export/users')
  async exportUsers(@Res() res: Response) {
    const result = await this._userService.findAllUserFromDb(1, 10000, '');
    const users: SafeUser[] = result.data || [];

    const columns: ExportColumn<SafeUser>[] = [
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Phone', accessor: 'phone' },
      { header: 'Location', accessor: 'location' as keyof SafeUser }, // casting if location is missing in strict SafeUser type
      {
        header: 'Status',
        accessor: (u: SafeUser) => (u.isBlock ? 'Inactive' : 'Active'),
      },
      { header: 'Role', accessor: (u: SafeUser) => u.role ?? 'USER' },
    ];

    const csv = this._csvService.generateCsv(users, columns);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=users_export.csv');
    res.send(csv);
  }

  @Get('/export/payouts')
  async exportPayouts(@Res() res: Response) {
    const result = await this._payoutRequestUsecase.payoutDetails(1, 10000);
    const payouts: PayoutDetailsDTO[] = result.data || [];

    const columns: ExportColumn<PayoutDetailsDTO>[] = [
      {
        header: 'Agency Name',
        accessor: (r: PayoutDetailsDTO) => r.agencyInfo.name,
      },
      {
        header: 'Agency Email',
        accessor: (r: PayoutDetailsDTO) => r.agencyInfo.email,
      },
      {
        header: 'Phone',
        accessor: (r: PayoutDetailsDTO) => r.agencyInfo.phone,
      },
      { header: 'Amount', accessor: 'amount' },
      { header: 'Status', accessor: 'status' },
      {
        header: 'Bank Name',
        accessor: (r: PayoutDetailsDTO) => r.bankDetails.bankName,
      },
      {
        header: 'Account Number',
        accessor: (r: PayoutDetailsDTO) => r.bankDetails.accountNumber,
      },
      {
        header: 'IFSC Code',
        accessor: (r: PayoutDetailsDTO) => r.bankDetails.ifscCode,
      },
    ];

    const csv = this._csvService.generateCsv(payouts, columns);

    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename=payouts_export.csv',
    );
    res.send(csv);
  }

  @Get('/export/transactions')
  async exportTransactions(@Res() res: Response) {
    const result = await this._adminRevenue.getTransactionSummary(1, 10000);
    const transactions: WalletTransactionDto[] = result.data || [];

    const columns: ExportColumn<WalletTransactionDto>[] = [
      {
        header: 'Date',
        accessor: (tx: WalletTransactionDto) =>
          new Date(tx.date).toLocaleDateString(),
      },
      {
        header: 'Time',
        accessor: (tx: WalletTransactionDto) =>
          new Date(tx.date).toLocaleTimeString(),
      },
      {
        header: 'Agency',
        accessor: (tx: WalletTransactionDto) => tx.agencyName || 'N/A',
      },
      {
        header: 'Destination',
        accessor: (tx: WalletTransactionDto) => tx.destination || 'N/A',
      },
      {
        header: 'Booking Code',
        accessor: (tx: WalletTransactionDto) => tx.bookingCode || 'N/A',
      },
      { header: 'Commission', accessor: 'commission' },
      { header: 'Status', accessor: 'status' },
      { header: 'Type', accessor: 'type' },
    ];

    const csv = this._csvService.generateCsv(transactions, columns);

    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename=transactions_export.csv',
    );
    res.send(csv);
  }

  @Get('/export/agency-revenue')
  async exportAgencyRevenue(@Res() res: Response) {
    const result = await this._agencyRevenue.getAgencyRevenueSummary(1, 10000);
    const revenue: AgencyRevenueDTO[] = result.data || [];

    const columns: ExportColumn<AgencyRevenueDTO>[] = [
      { header: 'Agency Name', accessor: 'agencyName' },
      { header: 'Agency ID', accessor: 'agencyId' },
      { header: 'Platform Earning', accessor: 'platformEarning' },
      { header: 'Total Bookings', accessor: 'all' },
    ];

    const csv = this._csvService.generateCsv(revenue, columns);

    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename=agency_revenue_export.csv',
    );
    res.send(csv);
  }
}
