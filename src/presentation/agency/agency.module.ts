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


@Module({
  imports:[CloudinaryModule,UsersModule,AdminModule],
  controllers: [AgencyController],
  providers: [
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
      useClass:AgencyPackageService
    },
    {
      provide:AGENCY_PROFILE_TYPE.IAgencyProfileService,
      useClass:AgencyProfilService
    },
    {
      provide:"INodemailerService",
      useClass:NodemailerService
    }
  ],
  exports: [
    'IAgencyService', 
    'IOtpService',
    AGENCY_PACKAGE_TYPE.IAgencyPackageService,
    AGENCY_PROFILE_TYPE.IAgencyProfileService

  ],
})
export class AgencyModule {}
