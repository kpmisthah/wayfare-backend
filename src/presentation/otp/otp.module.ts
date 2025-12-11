import { Module } from '@nestjs/common';
import { OtpService } from 'src/application/usecases/otp/implementation/otp.usecase';
import { NodemailerService } from 'src/infrastructure/utils/nodemailer.service';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';

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
