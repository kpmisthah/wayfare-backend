import { Module } from '@nestjs/common';
import { UserVerificationRepository } from 'src/infrastructure/database/prisma/repositories/user/userVerification.repository';
import { OtpService } from 'src/application/usecases/otp/implementation/otp.service';
import { NodemailerService } from 'src/infrastructure/utils/nodemailer.service';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [
    {
      provide: 'IOtpService',
      useClass: OtpService,
    },
    {
      provide:"INodemailerService",
      useClass:NodemailerService
    },
    UserVerificationRepository,
  ],
  exports: ['IOtpService'],
})
export class OtpModule {}
