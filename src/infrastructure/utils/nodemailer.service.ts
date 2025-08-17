import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import * as nodemailer from 'nodemailer';
import { INodeMailerService } from 'src/domain/interfaces/nodemailer.interface';
@Injectable()
export class NodemailerService implements INodeMailerService{
  private readonly emailTransporter;
  constructor(private readonly configService: ConfigService) {
    this.emailTransporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }
    private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  async sendOtpToEmail(email: string): Promise<string> {
    const otp = this.generateOtp();
    try {
      await this.emailTransporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: 'Your Otp Code',
        text: `Your Otp is ${otp}`,
        html: `<p>Your Otp is <strong>${otp}</strong></p>`,
      });
      return otp;
    } catch (error) {
      console.log(error);

      throw new Error('Failed to send OTP via email');
    }
  }
}
