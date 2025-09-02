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
import { Response } from 'express';
import { UserEntity } from 'src/domain/entities/user.entity';
import { RefreshToken } from 'src/domain/entities/refreshToken.entity';
import { Otp } from 'src/domain/entities/otp.entity';
import { JwtTokenFactory } from './jwt-token.factory';
import { IUserService } from 'src/application/usecases/users/interfaces/user.usecase.interface';
import { IOtpService } from 'src/application/usecases/otp/interfaces/otp.usecase.interface';
import { IAuthRepository } from 'src/domain/repositories/auth/auth.repository.interface';
import { IUserVerification } from 'src/domain/repositories/user/user-verification.repository.interface';
import { IAuthService } from 'src/application/usecases/auth/interfaces/auth.usecase.interface';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.usecase.interface';
import { Role } from 'src/domain/enums/role.enum';
import { IArgonService } from 'src/domain/interfaces/argon.service.interface';
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject('IUserService')
    private readonly userService: IUserService,

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
    private readonly argonService:IArgonService,
    private readonly jwtFactory: JwtTokenFactory,
  ) {}

  async signUp(signupDto: SignupDto) {
    try {
      const existingUser = await this.userService.findByEmail(signupDto.email);
      if (existingUser) {
        throw new BadRequestException('User already exist');
      }
      UserEntity.ensurePasswordMatch(
        signupDto.password,
        signupDto.confirmPassword,
      );      
      const hashPassword = await this.hash(signupDto.password)
      console.log(hashPassword,'hashPassword');
      await this.otpService.sendOtp(
        signupDto.email,
        signupDto.name,
        hashPassword,
        signupDto.role,
        signupDto.mobile ?? ""
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
    console.log(verifyOtpDto,'otp from front end');
    
    const record = await this.authRepo.findByOtp(verifyOtpDto.otp);
    console.log(record,'record in verifyOtp');
    
    if (!record || record?.otp != verifyOtpDto.otp) {
      throw new BadRequestException('Invalid Otp');
    }
    const otp = new Otp(record.otp, record.otp_expiry);
    console.log(otp,'from verifyOtp');
    
    if (!otp.isValid(verifyOtpDto.otp))
      throw new BadRequestException('Otp expired or invalid');
    // if (record.role == 'USER' || record.role == 'ADMIN') {
    // let userEntity = UserEntity.create(record)
    let createUser = {
      name:record.name,
      email:record.email,
      password:record.password,
      role:record.role,
      phone:record.phone
    }
    let user = await this.userService.create(createUser);
    console.log(user,'user in verify otp');
    
      if (!user) {
        throw new BadRequestException('User Creation is failed');
      }
      await this.authRepo.deleteTempUser(record.id);
      const tokens = await this.jwtFactory.generateTokens(
        user?.id,
        user?.name,
        user.role,
      );

      await this.updateRefreshToken(user?.id, tokens?.refreshToken, user.role);
      return {
        accessToken:tokens.accessToken,
        refreshToken:tokens.refreshToken,
        user
      }

    // } else if (record.role == 'AGENCY') {
    //   user = await this.agencyService.createAgency({
    //     ...record,
    //     refreshToken: null,
    //     name: record.name!,
    //     password: record.password!,
    //     phone: record.phone!,
    //   });
    //   await this.authRepo.deleteTempUser(record.id);
    //   res.json({
    //     message: 'Agency created successfully waiting admin approval',
    //   });
    // }

    // await this.authRepo.deleteTempUser(record.id);
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
        existingUser.password!,
        existingUser.name!,
        existingUser.role,
      );
      return 'otp send successfully'
    } catch (error) {
      return'resend otp failed'
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPassword.email)
    
    console.log(forgotPassword,'in auth service of forgot password');
    
      if (user && user.password) {
        return this.otpService.sendOtp(
          user.email,
          user.name,
          user.password,
          user.role,
        );
      }

    throw new UnauthorizedException('This email does not exist');
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
    // const user = await this.userService.findByEmail(resetPassword.email);
    // const agency = await this.agencyService.findByEmail(resetPassword.email);
    const user = await this.userService.findByEmail(resetPassword.email)
  
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
   
    if (!user.password) {
      throw new BadRequestException(
        'Password reset not allowed for this account',
      );
    }
    // const passwordHandler = new UserEntity(
    //   resetPassword.email,
    //   resetPassword.password,
    //   entity.name,
    // );
    // console.log(passwordHandler,'passwordHanldddddddddddd in backend');
    const hashedPassword = await this.hash(user.password)
    // const hashedPassword = passwordHandler.getHashedPassword()!;
    // console.log(hashedPassword,'hashpassword in reset password form');
    
    await this.authRepo.resetPassword(resetPassword.email, {
      password: hashedPassword,
    });

    const tokens = await this.jwtFactory.generateTokens(
      user.id,
      user.name,
      user.role,
    );
    console.log(tokens,'token in reset password service');
    
    await this.updateRefreshToken(user.id, tokens.refreshToken, user.role);

    const existingUser = await this.userService.findByEmail(
      resetPassword.email,
    );

    return {
      message: 'Password reset successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken:tokens.accessToken,
      refreshToken:tokens.refreshToken
    };
  }

  async signIn(loginDto: LoginDto) {
    try {
      console.log(loginDto);
    let userEntity = await this.userService.findByEmail(loginDto.email);
    console.log(userEntity,'userEntity');
    console.log("typeof",typeof userEntity?.role);
    
    
      if (!userEntity) {
        throw new BadRequestException('User does not exist');
      }
      if (userEntity.isBlock) {
        throw new ForbiddenException('Your Account has been Blocked by Admin');
      }
      // const userEntity = new UserEntity(user.email, user.password, user.name);
      
      console.log("password is: ",userEntity.password)

      const isMatch = await this.argonService.comparePassword(loginDto.password,userEntity.password)
      console.log(isMatch,'matching password');
      
      if (!isMatch) {
        throw new BadRequestException('Password is incorrect');
      }
      const tokens = await this.jwtFactory.generateTokens(
        userEntity.id,
        userEntity.name,
        userEntity.role,
      );
      if(!tokens) return new BadRequestException("Token not found")
      await this.updateRefreshToken(userEntity.id, tokens?.refreshToken,userEntity.role as Role);
      return {
        userEntity,
        accessToken:tokens.accessToken,
        refreshToken:tokens.refreshToken
      }

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      const user = await this.authRepo.logout(userId)
      return user;
    } catch (err) {
      console.error('Logout service failed:', err);
      throw err;
    }
  }

  async refreshToken(
    userId: string,
    refreshToken: string | null | undefined,
    res: Response,
    role: string,
  ) {
  
  
      let user = await this.userService.findById(userId);
    
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await this.argonService.comparePassword(
      user.refreshToken,
      refreshToken as string,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.jwtFactory.generateTokens(
      user.id,
      user.name,
      user.role,
    );
    await this.updateRefreshToken(user?.id, tokens?.refreshToken, user.role);

    return { message: 'Access token refreshed',accessTokenResponse:tokens.accessToken,refreshTokenResponse:tokens.refreshToken };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    role: Role
  ) {
    const hashRereshToken = await RefreshToken.hash(refreshToken);
    if (role == Role.User || role == Role.Admin) {
      await this.userService.update(userId, { refreshToken: hashRereshToken });
    }
  }

  async hash(password:string|null){
    if(!password){
      throw new Error("Password cannot be null")
    }
    return await this.argonService.hashPassword(password!)
  }
  //Google Auth
  googleLoginResponse(req, res) {
    const { user, appAccessToken, appRefreshToken } = req.user;
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

  // async handleGoogleLogin(
  //   email: string,
  //   name: string,
  //   image: string | null,
  //   res: Response,
  // ) {
  //   let user = await this.userService.findByEmail(email);
  //   if (!user) {
  //     user = await this.userService.create({
  //       name,
  //       email,
  //       password: null, // social login
  //       refreshToken: null,
  //       role
  //     });
  //   }
  //   if (!user?.name) {
  //     throw new UnauthorizedException('User not exist');
  //   }
  //   const tokens = await this.jwtFactory.generateTokens(
  //     user.id,
  //     user.name,
  //     user.role,
  //   );
  //   await this.updateRefreshToken(user.id, tokens.refreshToken, user.role);

  //   res
  //     .cookie('resfreshToken', tokens.refreshToken, {
  //       httpOnly: true,
  //       secure: false,
  //       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //       path: '/',
  //     })
  //     .cookie('accessToken', tokens.accessToken, {
  //       httpOnly: true,
  //       secure: false,
  //       expires: new Date(Date.now() + 5 * 60 * 1000),
  //       path: '/',
  //     });

  //   return { message: 'Google Login successful', user };
  // }
}
