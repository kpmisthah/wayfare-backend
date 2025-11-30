import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ADMIN_TYPE } from 'src/domain/types';
import { AdminService } from 'src/application/usecases/admin/implementation/admin.usecase';
import { AdminRevenue } from 'src/application/usecases/admin/implementation/total-revenue.usecase';
import { AgencyRevenue } from 'src/application/usecases/admin/implementation/agency.revenue';
import { GetAdminSummaryUseCase } from 'src/application/usecases/admin/implementation/get-admin-summary-usecase';

@Module({
  controllers: [AdminController],
  providers: [
    {
      provide: ADMIN_TYPE.IAdminService,
      useClass: AdminService,
    },
    {
      provide:"IAdminRevenue",
      useClass:AdminRevenue
    },
    {
      provide:"IAgencyRevenue",
      useClass:AgencyRevenue
    },
    {
      provide:"IAdminSummaryUsecase",
      useClass:GetAdminSummaryUseCase
    }
  ],
  exports: [ADMIN_TYPE.IAdminService],
})
export class AdminModule {}
