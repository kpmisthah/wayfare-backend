import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOtpService } from 'src/application/usecases/otp/interfaces/otp.usecase.interface';
import { Role } from 'src/domain/enums/role.enum';
import { NodemailerService } from 'src/infrastructure/utils/nodemailer.service';
import { IRedisService } from 'src/domain/interfaces/redis-service.interface';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('INodemailerService')
    private readonly nodemailerService: NodemailerService,
    @Inject('IRedisService')
    private readonly _redisService: IRedisService,
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
      const key = `otp:${email}`;
      await this._redisService.set(
        key,
        JSON.stringify({ otp, password, name, role, phone }),
        300,
      );
      console.log(`OTP for ${email}: ${otp}`);
    } catch (error) {
      console.log(error);
    }
  }
  async agencyVerification(email: string, loginLink: string) {
    try {
      await this.nodemailerService.sendAgencyVerificationEmail(
        email,
        loginLink,
      );
    } catch (error) {
      console.error('Failed to send agency verification email:', error);
    }
  }

  async sendForgotPasswordOtp(email: string) {
    const otp = await this.nodemailerService.sendOtpToEmail(email);
    const key = `forgot:${email}`;

    await this._redisService.set(key, JSON.stringify({ otp }), 300);

    console.log(`Forgot Password OTP for ${email}: ${otp}`);
    console.log(key, 'forgot_password_otp_key');
  }
}
