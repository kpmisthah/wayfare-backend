import { Module } from '@nestjs/common';
import { AgencyController } from './agency.controller';
import { AgencyService } from 'src/application/usecases/agency/implementation/agency.service';
import { OtpService } from 'src/application/usecases/otp/implementation/otp.service';
import { AgencyPackageService } from 'src/application/usecases/agency/implementation/agency.package.service';
import { AGENCY_PACKAGE_TYPE, AGENCY_PROFILE_TYPE } from 'src/domain/types';
import { AgencyProfilService } from 'src/application/usecases/agency/implementation/agency-profile.service';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';
import { NodemailerService } from 'src/infrastructure/utils/nodemailer.service';


@Module({
  imports:[CloudinaryModule,UsersModule],
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
