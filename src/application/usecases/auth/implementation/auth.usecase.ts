import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto, SignupDto } from 'src/application/dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpDto } from 'src/application/dtos/verifyOtp.dto';
import { ResendOtpDto } from 'src/application/dtos/resendOtp.dto';
import { ForgotPasswordDto } from 'src/application/dtos/forgotPassword.dto';
import { VerifyForgotPasswordDto } from 'src/application/dtos/verifyForgotPasswordDto';
import { ResetPasswordDto } from 'src/application/dtos/resetPassword.dto';
import { UserEntity } from 'src/domain/entities/user.entity';
import { Otp } from 'src/domain/entities/otp.entity';
import { JwtTokenFactory } from './jwt-token.factory';
import { IUserUsecase } from 'src/application/usecases/users/interfaces/user.usecase.interface';
import { IOtpService } from 'src/application/usecases/otp/interfaces/otp.usecase.interface';
import { IAuthRepository } from 'src/domain/repositories/auth/auth.repository.interface';
import { IUserVerification } from 'src/domain/repositories/user/user-verification.repository.interface';
import { IAuthUsecase } from 'src/application/usecases/auth/interfaces/auth.usecase.interface';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.usecase.interface';
import { Role } from 'src/domain/enums/role.enum';
import { IArgonService } from 'src/domain/interfaces/argon.service.interface';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { ChangePassword } from 'src/application/dtos/change-password.dto';
@Injectable()
export class AuthService implements IAuthUsecase {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject('IUserService')
    private readonly _userUsecase: IUserUsecase,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @Inject('IOtpService')
    private readonly otpService: IOtpService,

    @Inject('IAuthRepository')
    private readonly authRepo: IAuthRepository,

    @Inject('IUserVerification')
    private readonly userVerificationRepo: IUserVerification,

    @Inject('IAgencyService')
    private readonly agencyService: IAgencyService,
    @Inject('IArgonService')
    private readonly argonService: IArgonService,
    private readonly jwtFactory: JwtTokenFactory,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
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
      console.log(signupDto.password, 'passwordddddd before hashing');
      const hashPassword = await this.hash(signupDto.password);
      console.log(hashPassword, 'hashPassword');
      await this.otpService.sendOtp(
        signupDto.email,
        signupDto.name,
        hashPassword,
        signupDto.role,
        signupDto.mobile ?? '',
      );
      this.logger.log('Signup started');
      this.logger.warn('Something unusual');
      this.logger.error('Signup failed');
      return { message: 'Otp sent to your email verify that otp' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const record = await this.authRepo.findByOtp(verifyOtpDto.otp);

    if (!record || record?.otp != verifyOtpDto.otp) {
      throw new BadRequestException('Invalid Otp');
    }
    const otp = new Otp(record.otp, record.otp_expiry);

    if (!otp.isValid(verifyOtpDto.otp))
      throw new BadRequestException('Otp expired or invalid');
    const createUser = {
      name: record.name,
      email: record.email,
      password: record.password,
      role: record.role,
      phone: record.phone,
    };
    const user = await this._userUsecase.create(createUser);

    if (!user) {
      throw new BadRequestException('User Creation is failed');
    }
    await this.authRepo.deleteTempUser(record.id);
    const tokens = await this.jwtFactory.generateTokens(
      user?.id,
      user?.name,
      user.role,
    );

    await this.updateRefreshToken(user?.id, tokens?.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    try {
      const existingUser = await this.userVerificationRepo.findEmail(
        resendOtpDto.email,
      );
      if (!existingUser) {
        throw new UnauthorizedException('Please signup again');
      }

      await this.otpService.sendOtp(
        existingUser.email,
        existingUser.password,
        existingUser.name,
        existingUser.role,
      );
      return 'otp send successfully';
    } catch (error) {
      return `resend otp failed,${error}`;
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const user = await this._userUsecase.findByEmail(forgotPassword.email);
    console.log(forgotPassword, 'in auth service of forgot password');

    if (user && user.password) {
      return this.otpService.sendOtp(
        user.email,
        user.name,
        user.password,
        user.role,
      );
    }

    throw new BadRequestException('This email does not exist');
  }

  async verifyForgotPassword(verifyForgotPassword: VerifyForgotPasswordDto) {
    try {
      const findUser = await this.authRepo.findByOtp(verifyForgotPassword.otp);
      if (!findUser || findUser.otp != verifyForgotPassword.otp) {
        throw new BadRequestException('Invalid Otp');
      }
      if (findUser.otp_expiry < new Date()) {
        throw new Error('Otp is Expired');
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
    await this.authRepo.resetPassword(resetPassword.email, {
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
      const userEntity = await this._userUsecase.findByEmail(loginDto.email);
      console.log(userEntity, 'userEntity');
      if (!userEntity) {
        throw new BadRequestException('User does not exist');
      }
      if (userEntity.isBlock) {
        throw new ForbiddenException('Your Account has been Blocked by Admin');
      }
      const isMatch = await this.argonService.comparePassword(
        userEntity.password,
        loginDto.password,
      );
      console.log(isMatch, 'matching password');

      if (!isMatch) {
        throw new BadRequestException('Password is incorrect');
      }
      const tokens = await this.jwtFactory.generateTokens(
        userEntity.id,
        userEntity.name,
        userEntity.role,
      );
      if (!tokens) return new BadRequestException('Token not found');
      await this.updateRefreshToken(userEntity.id, tokens?.refreshToken);
      return {
        userEntity,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    try {
      const user = await this.authRepo.logout(userId);
      console.log(user, 'in logout');
      return { success: user };
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

    const refreshTokenMatches = await this.argonService.comparePassword(
      user.refreshToken,
      refreshToken,
    );
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
    const hashRereshToken = await this.argonService.hashPassword(refreshToken);
    await this._userUsecase.update(userId, { refreshToken: hashRereshToken });
  }

  async hash(password: string | null) {
    if (!password) {
      throw new Error('Password cannot be null');
    }
    return await this.argonService.hashPassword(password);
  }
  //Google Auth
  googleLoginResponse(req, res) {
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
      .redirect('http://localhost:3000');
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
    const isOldPasswordMatch = await this.argonService.comparePassword(
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
