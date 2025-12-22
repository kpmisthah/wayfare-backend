import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOtpService } from '../interfaces/otp.usecase.interface';
import { Role } from '../../../../domain/enums/role.enum';
import { NodemailerService } from '../../../../infrastructure/utils/nodemailer.service';
import { IRedisService } from '../../../../domain/interfaces/redis-service.interface';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    private readonly _configService: ConfigService,
    @Inject('INodemailerService')
    private readonly _nodemailerService: NodemailerService,
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
      const otp = await this._nodemailerService.sendOtpToEmail(email);
      const key = `otp:${email}`;
      await this._redisService.set(
        key,
        JSON.stringify({ otp, password, name, role, phone }),
        300,
      );
    } catch (error) {}
  }
  async agencyVerification(email: string, loginLink: string) {
    try {
      await this._nodemailerService.sendAgencyVerificationEmail(
        email,
        loginLink,
      );
    } catch (error) {
      console.error('Failed to send agency verification email:', error);
    }
  }

  async sendForgotPasswordOtp(email: string, name: string = 'User') {
    const otp = await this._nodemailerService.sendForgotPasswordOtp(
      email,
      name,
    );
    const key = `forgot:${email}`;

    await this._redisService.set(key, JSON.stringify({ otp }), 300);
  }
}
