import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import { IOtpService } from 'src/application/usecases/otp/interfaces/otp.service.interface';
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
    @Inject("INodemailerService")
    private readonly nodemailerService:NodemailerService
  ) {
    // this.emailTransporter = nodemailer.createTransport({
    //   host: this.configService.get<string>('EMAIL_HOST'),
    //   port: this.configService.get<number>('EMAIL_PORT'),
    //   auth: {
    //     user: this.configService.get<string>('EMAIL_USER'),
    //     pass: this.configService.get<string>('EMAIL_PASSWORD'),
    //   },
    // });
  }

  // async sendOtpToEmail(email: string): Promise<string> {
  //   const otp = this.generateOtp();
  //   try {
  //     await this.emailTransporter.sendMail({
  //       from: this.configService.get<string>('EMAIL_USER'),
  //       to: email,
  //       subject: 'Your Otp Code',
  //       text: `Your Otp is ${otp}`,
  //       html: `<p>Your Otp is <strong>${otp}</strong></p>`,
  //     });
  //     return otp;
  //   } catch (error) {
  //     console.log(error);

  //     throw new Error('Failed to send OTP via email');
  //   }
  // }
  async sendOtp(
    email: string,
    name: string,
    password: string,
    role: Role,
    phone?: string,
  ) {
    try {
      const otp = await this.nodemailerService.sendOtpToEmail(email)
      console.log(otp, 'otp');
      const existingUser = await this.userverificationRepo.findEmail(email);
      if (existingUser) {
        // await this.userverificationRepo.updateOtp(existingUser.email, {
        //   otp,
        //   otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
        // });
        let updateOtp = existingUser.updateUserOtp({otp,otp_expiry:new Date(Date.now()+5*60*1000)})
        await this.userverificationRepo.updateOtp(existingUser.email,updateOtp)
      } else {
        let otpEntity = new UserVerificationEntity('',name,email,otp,new Date(Date.now()+5*60*100),password,role,phone)
        //ithin buisness logic ezhutheela
        //is it violate solid principles?
        await this.userverificationRepo.create(otpEntity)
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
