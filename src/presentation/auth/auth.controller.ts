import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  UseGuards,
  Res,
  Inject,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LoginDto, SignupDto } from '../../application/dtos/auth.dto';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RefreshTokenGuard } from '../../infrastructure/common/guard/refreshToken.guard';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { VerifyOtpDto } from '../../application/dtos/verifyOtp.dto';
import { ResendOtpDto } from '../../application/dtos/resendOtp.dto';
import { ForgotPasswordDto } from '../../application/dtos/forgotPassword.dto';
import { VerifyForgotPasswordDto } from '../../application/dtos/verifyForgotPasswordDto';
import { ResetPasswordDto } from '../../application/dtos/resetPassword.dto';
import { Request, Response } from 'express';
import { IAuthUsecase } from '../../application/usecases/auth/interfaces/auth.usecase.interface';
import { IUserUsecase } from '../../application/usecases/users/interfaces/user.usecase.interface';
import { AuthGuard } from '@nestjs/passport';
import { GoogleLoginUseCase } from '../../application/usecases/auth/implementation/google-login.usecase';
import { ChangePassword } from '../../application/dtos/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly _authUsecase: IAuthUsecase,
    @Inject('IUserService')
    private readonly _userUsecase: IUserUsecase,
    @Inject('IGoogleLoginUsecase')
    private readonly _googleLoginUsecase: GoogleLoginUseCase,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request & { user: any },
    @Res() res: Response,
  ) {
    const result = await this._googleLoginUsecase.execute(
      req.user as {
        email: string;
        firstName: string;
        lastName: string;
        picture: string;
      },
    );
    res
      .cookie('accessToken', result.accessToken, {
        httpOnly: true,
        sameSite: 'none' as const,
        domain: '.misthah.site',
        maxAge: Number(process.env.JWT_ACCESS_EXPIRES),
        path: '/',
        secure: true,
      })
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        sameSite: 'none' as const,
        maxAge: Number(process.env.JWT_REFRESH_EXPIRES),
        domain: '.misthah.site',
        path: '/',
        secure: true,
      });
    res.redirect('https://wayfare.misthah.site/');
  }

  @Post('signin')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async signin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Response> {
    const { user, accessToken, refreshToken } =
      await this._authUsecase.signIn(loginDto);
    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        domain: '.misthah.site',
        expires: new Date(
          Date.now() + Number(process.env.JWT_REFRESH_EXPIRES!),
        ),
        sameSite: 'none' as const,
        path: '/',
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        domain: '.misthah.site',
        expires: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRES!)),
        path: '/',
      })
      .json({ message: 'Login Successfully', user });
  }

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  signup(@Body() singupDto: SignupDto) {
    return this._authUsecase.signUp(singupDto);
  }

  @Post('verify-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Response> {
    const { accessToken, refreshToken, user } =
      await this._authUsecase.verifyOtp(verifyOtpDto);
    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        domain: '.misthah.site',
        expires: new Date(
          Date.now() + Number(process.env.JWT_REFRESH_EXPIRES!),
        ),
        path: '/',
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        domain: '.misthah.site',
        sameSite: 'none' as const,
        expires: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRES!)),
        path: '/',
      })
      .json({ message: 'Signup verified successfully', user });
  }

  @Post('resend-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    const result = await this._authUsecase.resendOtp(resendOtpDto);
    return result;
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this._authUsecase.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-forgotPassword')
  verifyForgotPassword(
    @Body() verifyForgotPasswordDto: VerifyForgotPasswordDto,
  ) {
    return this._authUsecase.verifyForgotPassword(verifyForgotPasswordDto);
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Response> {
    const { accessToken, refreshToken, user, message } =
      await this._authUsecase.resetPassword(resetPasswordDto);
    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        domain: '.misthah.site',
        expires: new Date(
          Date.now() + Number(process.env.JWT_REFRESH_EXPIRES!),
        ),
        path: '/',
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        domain: '.misthah.site',
        expires: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRES!)),
        path: '/',
      })
      .json({ message, user });
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    const user = await this._userUsecase.findById(userId);
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('accessToken', {
      domain: '.misthah.site',
      path: '/',
    });
    res.clearCookie('refreshToken', {
      domain: '.misthah.site',
      path: '/',
    });
    const result = await this._authUsecase.logout(req.user.userId);
    return result;
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Response> {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    const user = await this._userUsecase.findById(userId);
    if (user?.isBlock) {
      throw new ForbiddenException('Account is Blocked');
    }
    const { accessTokenResponse, refreshTokenResponse } =
      await this._authUsecase.refreshToken(userId, refreshToken);
    return res
      .cookie('refreshToken', refreshTokenResponse, {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        domain: '.misthah.site',
        expires: new Date(
          Date.now() + Number(process.env.JWT_REFRESH_EXPIRES!),
        ),
        path: '/',
      })
      .cookie('accessToken', accessTokenResponse, {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        domain: '.misthah.site',
        expires: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRES!)),
        path: '/',
      })
      .json({ success: true });
  }

  @Patch('change-password')
  @UseGuards(AccessTokenGuard)
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() changePassword: ChangePassword,
  ) {
    const userId = req.user['userId'];
    return await this._authUsecase.changePassword(userId, changePassword);
  }
}
