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
  NotFoundException,
} from '@nestjs/common';
import { LoginDto, SignupDto } from 'src/application/dtos/auth.dto';
// import { Request } from 'express';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { RefreshTokenGuard } from 'src/infrastructure/common/guard/refreshToken.guard';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { VerifyOtpDto } from 'src/application/dtos/verifyOtp.dto';
import { ResendOtpDto } from 'src/application/dtos/resendOtp.dto';
import { ForgotPasswordDto } from 'src/application/dtos/forgotPassword.dto';
import { VerifyForgotPasswordDto } from 'src/application/dtos/verifyForgotPasswordDto';
import { ResetPasswordDto } from 'src/application/dtos/resetPassword.dto';
// import { GoogleOAuthGuard } from 'src/infrastructure/common/guard/google-oauth.guard';
import { Request, Response } from 'express';
// import { GoogleLoginDto } from 'src/application/dtos/googleLogin.dto';
import { IAuthUsecase } from 'src/application/usecases/auth/interfaces/auth.usecase.interface';
import { IUserUsecase } from 'src/application/usecases/users/interfaces/user.usecase.interface';
import { AuthGuard } from '@nestjs/passport';
import { GoogleLoginUseCase } from 'src/application/usecases/auth/implementation/google-login.usecase';
// import { Role as userRole } from 'src/domain/enums/role.enum';
// import { Roles } from '../roles/roles.decorator';
// import { RolesGuard } from '../roles/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly _authUsecase: IAuthUsecase,
    @Inject('IUserService')
    private readonly userService: IUserUsecase,
    private readonly _googleLoginUsecase:GoogleLoginUseCase
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res() res:Response
  ) {
    const result = await this._googleLoginUsecase.execute(req.user)
      res
    .cookie('accessToken', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
      path: '/',
      secure: false, 
    })
    .cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/',
      secure: false, 
    });
     res.redirect('http://localhost:3000/');
  }


  @Post('signin')
  // @Roles(userRole.User,userRole.Agency)
  // @UseGuards(RolesGuard)
  async signin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this._authUsecase.signIn(loginDto);
      console.log(user,'iuser')
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: '/',
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        path: '/',
      })
      .json({ message: 'Login Successfully', user });
  }

  @Post('signup')
  signup(@Body() singupDto: SignupDto, @Req() req: Request) {
    console.log(singupDto, 'signupDto gooys');
    return this._authUsecase.signUp(singupDto);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this._authUsecase.verifyOtp(verifyOtpDto);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: '/',
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        path: '/',
      })
      .json({ message: 'Signup verified successfully', user });
  }

  @Post('resend-otp')
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._authUsecase.resendOtp(resendOtpDto);
    return res.json({ result });
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    console.log('forgot password controller l ethunnund');

    return this._authUsecase.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-forgotPassword')
  verifyForgotPassword(
    @Body() verifyForgotPasswordDto: VerifyForgotPasswordDto,
  ) {
    return this._authUsecase.verifyForgotPassword(verifyForgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user, message } =
      await this._authUsecase.resetPassword(resetPasswordDto);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: '/',
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        path: '/',
      })
      .json({ message, user });
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    const user = await this.userService.findById(userId);
    console.log(user, 'user in /me');
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    const result = await this._authUsecase.logout(req.user.userId);
    console.log(result,'resultttt')
    return result;
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user['userId'];
    const role = req.user['role'];
    const refreshToken = req.user['refreshToken'];
    console.log('user id is there', userId);
    const user = await this.userService.findById(userId);
    if (user?.isBlock) {
      throw new ForbiddenException('Account is Blocked');
    }
    const { accessTokenResponse, refreshTokenResponse, message } =
      await this._authUsecase.refreshToken(userId, refreshToken, res, role);
    res
      .cookie('refreshToken', refreshTokenResponse, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 5 * 60 * 1000),
      })
      .cookie('accessToken', accessTokenResponse, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      })
      .json(message);
  }

}
