import { Module } from '@nestjs/common';
import { OtpService } from '../../application/usecases/otp/implementation/otp.usecase';
import { NodemailerService } from '../../infrastructure/utils/nodemailer.service';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: 'IOtpService',
      useClass: OtpService,
    },
    {
      provide: 'INodemailerService',
      useClass: NodemailerService,
    },
  ],
  exports: ['IOtpService', 'INodemailerService'],
})
export class OtpModule {}
