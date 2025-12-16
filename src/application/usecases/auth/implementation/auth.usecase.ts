import { Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { LoginDto, SignupDto } from '../../../dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpDto } from '../../../dtos/verifyOtp.dto';
import { ResendOtpDto } from '../../../dtos/resendOtp.dto';
import { ForgotPasswordDto } from '../../../dtos/forgotPassword.dto';
import { VerifyForgotPasswordDto } from '../../../dtos/verifyForgotPasswordDto';
import { ResetPasswordDto } from '../../../dtos/resetPassword.dto';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { JwtTokenFactory } from './jwt-token.factory';
import { IUserUsecase } from '../../users/interfaces/user.usecase.interface';
import { IOtpService } from '../../otp/interfaces/otp.usecase.interface';
import { IAuthRepository } from '../../../../domain/repositories/auth/auth.repository.interface';
import { IAuthUsecase } from '../interfaces/auth.usecase.interface';
import { IAgencyService } from '../../agency/interfaces/agency.usecase.interface';
import { IArgonService } from '../../../../domain/interfaces/argon.service.interface';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { ChangePassword } from '../../../dtos/change-password.dto';
import { IRedisService } from '../../../../domain/interfaces/redis-service.interface';
import { NodemailerService } from '../../../../infrastructure/utils/nodemailer.service';
import { StatusCode } from '../../../../domain/enums/status-code.enum';
import { Role } from '../../../../domain/enums/role.enum';
@Injectable()
export class AuthService implements IAuthUsecase {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly _logger: LoggerService,
    @Inject('IUserService')
    private readonly _userUsecase: IUserUsecase,

    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,

    @Inject('IOtpService')
    private readonly _otpService: IOtpService,

    @Inject('IAuthRepository')
    private readonly _authRepo: IAuthRepository,

    @Inject('IAgencyService')
    private readonly _agencyService: IAgencyService,

    @Inject('IArgonService')
    private readonly _argonService: IArgonService,

    private readonly jwtFactory: JwtTokenFactory,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,

    @Inject('IRedisService')
    private readonly _redisService: IRedisService,

    @Inject('INodemailerService')
    private readonly _nodemailerService: NodemailerService,
  ) {}

  async signUp(signupDto: SignupDto) {
    try {
      const existingUser = await this._userUsecase.findByEmail(signupDto.email);
      if (existingUser) {
        throw new BadRequestException('User already exist');
      }
      UserEntity.ensurePasswordMatch(
        signupDto.password,
        signupDto.confirmPassword,
      );
      this._logger.debug?.('Hashing password for signup', {
        email: signupDto.email,
      });
      const hashPassword = await this.hash(signupDto.password);
      await this._otpService.sendOtp(
        signupDto.email,
        signupDto.name,
        hashPassword,
        signupDto.role,
        signupDto.mobile ?? '',
      );
      this._logger.log('Signup OTP sent successfully', {
        email: signupDto.email,
      });
      return { message: 'Otp sent to your email verify that otp' };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this._logger.error('Signup failed', {
        email: signupDto.email,
        error: err.message,
      });
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    this._logger.debug?.('Verifying OTP', { email: verifyOtpDto.email });

    const key = `otp:${verifyOtpDto.email}`;
    const data = await this._redisService.get(key);
    if (!data) {
      throw new BadRequestException('OTP expired or invalid');
    }
    const parsed = JSON.parse(data) as {
      otp: string;
      name: string;
      password: string;
      role: Role;
      phone?: string;
    };
    if (parsed.otp !== verifyOtpDto.otpCode) {
      throw new BadRequestException('Invalid OTP');
    }

    await this._redisService.del(key);
    const createUser = {
      name: parsed.name,
      email: verifyOtpDto.email,
      password: parsed.password,
      role: parsed.role,
      phone: parsed.phone || '',
    };
    const user = await this._userUsecase.create(createUser);

    if (!user) {
      throw new BadRequestException('User Creation is failed');
    }
    const tokens = await this.jwtFactory.generateTokens(
      user?.id,
      user?.name,
      user.role,
    );

    await this.updateRefreshToken(user?.id, tokens?.refreshToken);
    this._logger.log('User verified and created', {
      userId: user.id,
      email: user.email,
    });
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    try {
      this._logger.debug?.('Resending OTP', { email: resendOtpDto.email });

      const key = `otp:${resendOtpDto.email}`;
      const existingData = await this._redisService.get(key);

      if (!existingData) {
        throw new UnauthorizedException(
          'No active signup found for this email',
        );
      }
      const oldPayload = JSON.parse(existingData) as {
        otp: string;
        name: string;
        password: string;
        role: Role;
        phone?: string;
      };
      const rateKey = `otp-resend-rate:${resendOtpDto.email}`;

      const currentCount = await this._redisService.get(rateKey);
      const count = currentCount ? parseInt(currentCount) : 0;

      if (count >= 3) {
        throw new BadRequestException(
          'Too many resend attempts. Please wait 1 hour.',
        );
      }

      const newOtp = await this._nodemailerService.sendOtpToEmail(
        resendOtpDto.email,
      );

      const newPayload = {
        ...oldPayload,
        otp: newOtp,
      };

      await this._redisService.set(key, JSON.stringify(newPayload), 300);
      this._logger.log('OTP resent successfully', {
        email: resendOtpDto.email,
      });

      return { message: 'New OTP sent successfully' };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this._logger.error('Resend OTP failed', {
        email: resendOtpDto.email,
        error: err.message,
      });
      throw error;
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const user = await this._userUsecase.findByEmail(forgotPassword.email);
    console.log(forgotPassword, 'in auth service of forgot password');
    if (!user) {
      throw new BadRequestException('This email does not exist');
    }

    await this._otpService.sendForgotPasswordOtp(user.email, user.name);
  }

  async verifyForgotPassword(verifyForgotPassword: VerifyForgotPasswordDto) {
    try {
      console.log(verifyForgotPassword, 'Verify forgot password dtooooo');
      const key = `forgot:${verifyForgotPassword.email}`;
      const data = await this._redisService.get(key);
      if (!data) throw new BadRequestException('OTP expired or not found');
      const { otp } = JSON.parse(data) as { otp: string };
      if (otp !== verifyForgotPassword.otp) {
        throw new BadRequestException('Invalid OTP');
      }
      return { message: 'Reset password page loaded successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetPassword(resetPassword: ResetPasswordDto) {
    const user = await this._userUsecase.findByEmail(resetPassword.email);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    if (!user.password) {
      throw new BadRequestException(
        'Password reset not allowed for this account',
      );
    }
    console.log(resetPassword, 'password resett');
    const hashedPassword = await this.hash(resetPassword.password);
    await this._authRepo.resetPassword(resetPassword.email, {
      password: hashedPassword,
    });

    const tokens = await this.jwtFactory.generateTokens(
      user.id,
      user.name,
      user.role,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await this._userUsecase.findByEmail(resetPassword.email);

    return {
      message: 'Password reset successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async signIn(loginDto: LoginDto) {
    try {
      console.log(loginDto, 'loginDto');
      const userWithPassword = await this._userUsecase.findByEmail(
        loginDto.email,
      );
      console.log(userWithPassword, 'userWithPassword');
      if (!userWithPassword) {
        throw new BadRequestException('User does not exist');
      }
      if (userWithPassword.isBlock) {
        throw new ForbiddenException('Your Account has been Blocked by Admin');
      }
      const isMatch = await this._argonService.comparePassword(
        userWithPassword.password,
        loginDto.password,
      );
      console.log(isMatch, 'matching password');

      if (!isMatch) {
        throw new BadRequestException('Password is incorrect');
      }
      const tokens = await this.jwtFactory.generateTokens(
        userWithPassword.id,
        userWithPassword.name,
        userWithPassword.role,
      );
      if (!tokens) throw new BadRequestException('Token not found');
      await this.updateRefreshToken(userWithPassword.id, tokens?.refreshToken);
      // Return AuthUserDto (no password) instead of UserEntity
      return {
        user: {
          id: userWithPassword.id,
          name: userWithPassword.name,
          email: userWithPassword.email,
          role: userWithPassword.role,
          isVerified: userWithPassword.isVerified,
          isBlock: userWithPassword.isBlock,
          phone: userWithPassword.phone,
          profileImage: userWithPassword.profileImage,
          bannerImage: userWithPassword.bannerImage,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout(userId: string): Promise<{ success: StatusCode; role: Role }> {
    try {
      const user = await this._authRepo.logout(userId);
      console.log(user, 'in logout');
      return { success: StatusCode.SUCCESS, role: user.role };
    } catch (err) {
      console.error('Logout service failed:', err);
      throw err;
    }
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this._userUsecase.findById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    console.log(
      '__________USER token',
      user.refreshToken,
      'another',
      refreshToken,
    );

    const refreshTokenMatches = await this._argonService.comparePassword(
      user.refreshToken,
      refreshToken,
    );
    console.log(refreshTokenMatches, 'refreshokenMatches');

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.jwtFactory.generateTokens(
      user.id,
      user.name,
      user.role,
    );
    await this.updateRefreshToken(user?.id, tokens?.refreshToken);

    return {
      message: 'Access token refreshed',
      accessTokenResponse: tokens.accessToken,
      refreshTokenResponse: tokens.refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashRereshToken = await this._argonService.hashPassword(refreshToken);
    await this._userUsecase.update(userId, { refreshToken: hashRereshToken });
  }

  async hash(password: string | null) {
    if (!password) {
      throw new Error('Password cannot be null');
    }
    return await this._argonService.hashPassword(password);
  }
  //Google Auth
  googleLoginResponse(
    req: Request & {
      user: { appAccessToken: string; appRefreshToken: string };
    },
    res: Response,
  ) {
    const { appAccessToken, appRefreshToken } = req.user;
    res
      .cookie('accessToken', appAccessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 5 * 60 * 1000,
      })
      .cookie('refreshToken', appRefreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect('http://app:3000');
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePassword,
  ): Promise<{ message: string }> {
    const user = await this._userRepo.findById(userId);
    console.log(user);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isOldPasswordMatch = await this._argonService.comparePassword(
      user.password,
      changePasswordDto.oldPassword,
    );
    console.log(isOldPasswordMatch, 'oldmatch');

    if (!isOldPasswordMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    const hashedNewPassword = await this.hash(changePasswordDto.newPassword);
    const userEntity = user.update({
      password: hashedNewPassword,
    });
    console.log(userEntity, 'user entity');
    await this._userUsecase.update(userId, userEntity);
    return { message: 'Password changed successfully' };
  }
}
