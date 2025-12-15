import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import * as nodemailer from 'nodemailer';
import { INodeMailerService } from '../../domain/interfaces/nodemailer.interface';
@Injectable()
export class NodemailerService implements INodeMailerService {
  private readonly emailTransporter: nodemailer.Transporter;
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

  async sendForgotPasswordOtp(email: string, name: string): Promise<string> {
    const otp = this.generateOtp();
    try {
      await this.emailTransporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: 'Reset Your Password - OTP',
        text: `Hi ${name}, Your password reset OTP is ${otp}. It expires in 10 minutes.`,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
          <h2>Hi ${name},</h2>
          <p>You requested to reset your password.</p>
          <p style="font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">
            ${otp}
          </p>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
      });
      return otp;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to send forgot password OTP');
    }
  }

  async sendAgencyVerificationEmail(
    email: string,
    loginLink: string,
  ): Promise<void> {
    try {
      await this.emailTransporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: 'Agency Verification Approved',
        html: `<p>Your agency has been approved. <a href="${loginLink}">Click here to log in</a></p>`,
      });
    } catch (error) {
      console.error('Failed to send agency verification email:', error);
      throw new Error('Failed to send agency verification email');
    }
  }
}
