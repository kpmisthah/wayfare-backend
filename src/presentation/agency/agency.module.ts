import { Module } from '@nestjs/common';
import { AgencyController } from './agency.controller';
import { AgencyService } from 'src/application/usecases/agency/implementation/agency.usecase';
import { OtpService } from 'src/application/usecases/otp/implementation/otp.usecase';
import { AgencyPackageService } from 'src/application/usecases/agency/implementation/agency.package.usecase';
import { AGENCY_PACKAGE_TYPE, AGENCY_PROFILE_TYPE } from 'src/domain/types';
import { AgencyProfilService } from 'src/application/usecases/agency/implementation/agency-profile.usecase';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';
import { NodemailerService } from 'src/infrastructure/utils/nodemailer.service';
import { AdminModule } from '../admin/admin.module';
import { BankingDetailsUsecase } from 'src/application/usecases/agency/implementation/bank-details.usecase';
import { WalletModule } from '../wallet/wallet.module';
// import { SearchModule } from 'src/infrastructure/elastic-search/elastic-search.module';

import { AgencyDashboardController } from './agency-dashboard.controller';
import { AgencyDashboardUseCase } from 'src/application/usecases/agency/implementation/agency-dashboard.usecase';
import { AgencyDashboardRepository } from 'src/infrastructure/database/prisma/repositories/agency/agency-dashboard.repository';

@Module({
  imports: [CloudinaryModule, UsersModule, AdminModule, WalletModule],
  controllers: [AgencyDashboardController, AgencyController],
  providers: [
    {
      provide: 'IAgencyDashboardRepository',
      useClass: AgencyDashboardRepository,
    },
    {
      provide: AgencyDashboardUseCase,
      useClass: AgencyDashboardUseCase,
    },
    {
      provide: 'IAgencyService',
      useClass: AgencyService,
    },
    {
      provide: 'IOtpService',
      useClass: OtpService,
    },
    {
      provide: AGENCY_PACKAGE_TYPE.IAgencyPackageService,
      useClass: AgencyPackageService,
    },
    {
      provide: AGENCY_PROFILE_TYPE.IAgencyProfileService,
      useClass: AgencyProfilService,
    },
    {
      provide: 'INodemailerService',
      useClass: NodemailerService,
    },
    {
      provide: 'IBankingDetailsUsecase',
      useClass: BankingDetailsUsecase,
    },
  ],
  exports: [
    'IAgencyService',
    'IOtpService',
    AGENCY_PACKAGE_TYPE.IAgencyPackageService,
    AGENCY_PROFILE_TYPE.IAgencyProfileService,
  ],
})
export class AgencyModule {}
