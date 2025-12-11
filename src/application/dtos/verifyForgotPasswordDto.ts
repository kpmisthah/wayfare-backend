import { IsString } from 'class-validator';

export class VerifyForgotPasswordDto {
  @IsString()
  otp: string;
  email: string;
}
