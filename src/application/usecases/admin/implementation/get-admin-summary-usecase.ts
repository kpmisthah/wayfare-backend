import { IBookingRepository } from 'src/domain/repositories/booking/booking.repository';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { Inject } from '@nestjs/common';
import { ITransactionRepository } from 'src/domain/repositories/transaction/transaction.repository';
import { IAdminSumaryUsecase } from '../interfaces/admin-summary-usecase.interface';
import { DashboardStats } from 'src/domain/types/stat.type';
export class GetAdminSummaryUseCase implements IAdminSumaryUsecase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    @Inject('IBookingRepository')
    private readonly _bookingRepo: IBookingRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
    @Inject('ITransactionRepository')
    private readonly _transactionRepo: ITransactionRepository,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {

    const [
      totalUsers,
      totalBookings,
      totalAgencies,
      totalRevenue,
      revenueOverview,
      bookingStatusOverview,
    ] = await Promise.all([
      this._userRepo.countAll(),
      this._bookingRepo.countAll(),
      this._agencyRepo.countAll(),
      this._transactionRepo.getTotalRevenue(),
      this._transactionRepo.getRevenueOverview(),
      this._transactionRepo.getBookingStatusDistribution(),
    ]);

    return {
      cards: {
        totalUsers,
        totalBookings,
        totalAgencies,
        totalRevenue,
      },
      charts: {
        revenueOverview,
        bookingStatusOverview,
      },
    };
  }
}
