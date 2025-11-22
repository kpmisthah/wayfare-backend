import { SignupDto, LoginDto } from 'src/application/dtos/auth.dto';
import { VerifyOtpDto } from 'src/application/dtos/verifyOtp.dto';
import { ResendOtpDto } from 'src/application/dtos/resendOtp.dto';
import { ForgotPasswordDto } from 'src/application/dtos/forgotPassword.dto';
import { VerifyForgotPasswordDto } from 'src/application/dtos/verifyForgotPasswordDto';
import { ResetPasswordDto } from 'src/application/dtos/resetPassword.dto';
import { Response } from 'express';
import { Role } from 'src/domain/enums/role.enum';
import { $Enums } from '@prisma/client';
import { ChangePassword } from 'src/application/dtos/change-password.dto';

interface User {
  id: string;
  name: string;
  role: $Enums.Role;
}
export interface IAuthUsecase {
  signUp(signupDto: SignupDto): Promise<any>;
  verifyOtp(dto: VerifyOtpDto): Promise<any>;
  resendOtp(dto: ResendOtpDto): Promise<any>;
  forgotPassword(dto: ForgotPasswordDto): Promise<void>;
  verifyForgotPassword(dto: VerifyForgotPasswordDto): Promise<any>;
  resetPassword(dto: ResetPasswordDto): Promise<{
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
  }>;
  signIn(dto: LoginDto): Promise<any>;
  logout(userId: string): Promise<any>;
  refreshToken(
    userId: string,
    refreshToken: string | null | undefined,
    res: Response,
    role: string,
  ): Promise<any>;
  updateRefreshToken(
    userId: string,
    refreshToken: string,
    role: Role,
  ): Promise<void>;
  googleLoginResponse(req: any, res: Response): void;
  changePassword(userId: string, changePasswordDto: ChangePassword)
  // handleGoogleLogin(
  //   email: string,
  //   name: string,
  //   image: string | null,
  //   res: Response,
  // ): Promise<any>;
}
