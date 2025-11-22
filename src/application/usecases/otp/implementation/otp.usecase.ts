import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOtpService } from 'src/application/usecases/otp/interfaces/otp.usecase.interface';
import { IUserVerification } from 'src/domain/repositories/user/user-verification.repository.interface';
import { UserVerificationEntity } from 'src/domain/entities/user-verification';
import { Role } from 'src/domain/enums/role.enum';
import { NodemailerService } from 'src/infrastructure/utils/nodemailer.service';

@Injectable()
export class OtpService implements IOtpService {
  private readonly emailTransporter;
  constructor(
    private readonly configService: ConfigService,
    @Inject('IUserVerification')
    private readonly userverificationRepo: IUserVerification,
    @Inject('INodemailerService')
    private readonly nodemailerService: NodemailerService,
  ) {}

  async sendOtp(
    email: string,
    name: string,
    password: string,
    role: Role,
    phone?: string,
  ) {
    try {
      const otp = await this.nodemailerService.sendOtpToEmail(email);
      console.log(otp, 'otp');
      const existingUser = await this.userverificationRepo.findEmail(email);
      if (existingUser) {
        const updateOtp = existingUser.updateUserOtp({
          otp,
          otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
        });
        await this.userverificationRepo.updateOtp(
          existingUser.email,
          updateOtp,
        );
      } else {
        const otpEntity = new UserVerificationEntity(
          '',
          name,
          email,
          otp,
          new Date(Date.now() + 5 * 60 * 100),
          password,
          role,
          phone,
        );
        await this.userverificationRepo.create(otpEntity);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async agencyVerification(email: string, loginLink: string) {
    try {
      await this.emailTransporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: 'Agency Verification Approved',
        html: `<p>Your agency has been approved. <a href="${loginLink}">Click here to log in</a></p>`,
      });
    } catch (error) {
      console.error('Failed to send agency verification email:', error);
    }
  }
}
