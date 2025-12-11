import { SignupDto, LoginDto } from 'src/application/dtos/auth.dto';
import { VerifyOtpDto } from 'src/application/dtos/verifyOtp.dto';
import { ResendOtpDto } from 'src/application/dtos/resendOtp.dto';
import { ForgotPasswordDto } from 'src/application/dtos/forgotPassword.dto';
import { VerifyForgotPasswordDto } from 'src/application/dtos/verifyForgotPasswordDto';
import { ResetPasswordDto } from 'src/application/dtos/resetPassword.dto';
import { Request, Response } from 'express';
import { Role } from 'src/domain/enums/role.enum';
import { $Enums } from '@prisma/client';
import { ChangePassword } from 'src/application/dtos/change-password.dto';
import { UserEntity } from 'src/domain/entities/user.entity';

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?:
    | UserEntity
    | { id: string; name: string; email: string; role: $Enums.Role };
  userEntity?: UserEntity;
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
      | UserEntity
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
  ): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }>;
  logout(userId: string): Promise<{ success: number; role: Role }>;
  refreshToken(
    userId: string,
    refreshToken: string | null | undefined,
    // res: Response, // Removed unused param based on implementation
    // role: string, // Removed unused param based on implementation
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
