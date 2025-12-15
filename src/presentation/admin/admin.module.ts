import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { ADMIN_TYPE } from '../../domain/types';
import { AdminService } from '../../application/usecases/admin/implementation/admin.usecase';
import { AdminRevenue } from '../../application/usecases/admin/implementation/total-revenue.usecase';
import { AgencyRevenue } from '../../application/usecases/admin/implementation/agency.revenue';
import { GetAdminSummaryUseCase } from '../../application/usecases/admin/implementation/get-admin-summary-usecase';
import { BookingModule } from '../booking/booking.module';
import { PaymentModule } from '../payment/payment.module';

import { CsvService } from '../../infrastructure/utils/csv.service';

@Module({
  imports: [BookingModule, PaymentModule, UsersModule],
  controllers: [AdminController],
  providers: [
    CsvService,
    {
      provide: ADMIN_TYPE.IAdminService,
      useClass: AdminService,
    },
    {
      provide: 'IAdminRevenue',
      useClass: AdminRevenue,
    },
    {
      provide: 'IAgencyRevenue',
      useClass: AgencyRevenue,
    },
    {
      provide: 'IAdminSummaryUsecase',
      useClass: GetAdminSummaryUseCase,
    },
  ],
  exports: [ADMIN_TYPE.IAdminService],
})
export class AdminModule {}
