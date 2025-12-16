import { SignupDto, LoginDto } from '../../../dtos/auth.dto';
import { VerifyOtpDto } from '../../../dtos/verifyOtp.dto';
import { ResendOtpDto } from '../../../dtos/resendOtp.dto';
import { ForgotPasswordDto } from '../../../dtos/forgotPassword.dto';
import { VerifyForgotPasswordDto } from '../../../dtos/verifyForgotPasswordDto';
import { ResetPasswordDto } from '../../../dtos/resetPassword.dto';
import { Request, Response } from 'express';
import { Role } from '../../../../domain/enums/role.enum';
import { $Enums } from '@prisma/client';
import { ChangePassword } from '../../../dtos/change-password.dto';
import { AuthUserDto } from '../../../dtos/auth-user.dto';

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?:
    | AuthUserDto
    | { id: string; name: string; email: string; role: $Enums.Role };
}

export interface RefreshTokenResponse {
  message: string;
  accessTokenResponse: string;
  refreshTokenResponse: string;
}

export interface IAuthUsecase {
  signUp(signupDto: SignupDto): Promise<{ message: string }>;
  verifyOtp(dto: VerifyOtpDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user:
      | AuthUserDto
      | { id: string; name: string; email: string; role: $Enums.Role };
  }>;
  resendOtp(dto: ResendOtpDto): Promise<{ message: string }>;
  forgotPassword(dto: ForgotPasswordDto): Promise<void>;
  verifyForgotPassword(
    dto: VerifyForgotPasswordDto,
  ): Promise<{ message: string }>;
  resetPassword(dto: ResetPasswordDto): Promise<{
    message: string;
    user: { id: string; name: string; email: string; role: $Enums.Role };
    accessToken: string;
    refreshToken: string;
  }>;
  signIn(
    dto: LoginDto,
  ): Promise<{ user: AuthUserDto; accessToken: string; refreshToken: string }>;
  logout(userId: string): Promise<{ success: number; role: Role }>;
  refreshToken(
    userId: string,
    refreshToken: string | null | undefined,
  ): Promise<RefreshTokenResponse>;
  updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
  googleLoginResponse(
    req: Request & {
      user: { appAccessToken: string; appRefreshToken: string };
    },
    res: Response,
  ): void;
  changePassword(
    userId: string,
    changePasswordDto: ChangePassword,
  ): Promise<{ message: string }>;
}
