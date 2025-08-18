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
import { GoogleOAuthGuard } from 'src/infrastructure/common/guard/google-oauth.guard';
import { Request, Response } from 'express';
import { GoogleLoginDto } from 'src/application/dtos/googleLogin.dto';
import { IAuthService } from 'src/application/usecases/auth/interfaces/auth.service.interface';
import { IUserService } from 'src/application/usecases/users/interfaces/user.service.interface';
import { Role as userRole} from 'src/domain/enums/role.enum';
import { Roles} from '../roles/roles.decorator';
import { RolesGuard } from '../roles/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  // @Get('/google')
  // @UseGuards(GoogleOAuthGuard)
  // async googleAuth(@Request() req) {}

  // @Get('google/callback')
  // @UseGuards(GoogleOAuthGuard)
  // googleAuthRedirect(
  //   @Request() req,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return this.authService.googleLoginResponse(req, res);
  // }
  // @Post('google-login')
  // async googleLogin(
  //   @Body() body: GoogleLoginDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return await this.authService.handleGoogleLogin(
  //     body.email,
  //     body.name,
  //     body.image ?? null,
  //     res,
  //   );
  // }

  @Post('signin')
  // @Roles(userRole.User,userRole.Agency)
  // @UseGuards(RolesGuard) 
  async signin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.signIn(
      loginDto
    );
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
        expires: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
        path: '/',
      })
      .json({ message: 'Login Successfully', user });
  }

  @Post('signup')
  signup(@Body() singupDto: SignupDto, @Req() req: Request) {
    console.log(singupDto,'signupDto gooys');
    return this.authService.signUp(singupDto);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken,user } = await this.authService.verifyOtp(
      verifyOtpDto
    );
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
        expires: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
        path: '/',
      })
      .json({ message: 'Signup verified successfully',user });
  }

  @Post('resend-otp')
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let result = await this.authService.resendOtp(resendOtpDto);
    return res.json({ result });
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    console.log("forgot password controller l ethunnund");
    
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-forgotPassword')
  verifyForgotPassword(
    @Body() verifyForgotPasswordDto: VerifyForgotPasswordDto,
  ) {
    return this.authService.verifyForgotPassword(verifyForgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let { accessToken, refreshToken, user, message } = await this.authService.resetPassword(resetPasswordDto);
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
        expires: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
        path: '/',
      })
      .json({message,user});
      
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    console.log("Ivide verundoo /meeee in backend porifiel");
    
    return this.userService.findById(req.user.userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/logout')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    const result = await this.authService.logout(req.user.userId);
    return result;
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user['sub'];
    const role = req.user['role'];
    const refreshToken = req.user['refreshToken'];
    const user = await this.userService.findById(userId);
    if (user.isBlock) {
      throw new ForbiddenException('Account is Blocked');
    }
    const { accessTokenResponse, refreshTokenResponse, message } =
      await this.authService.refreshToken(userId, refreshToken, res, role);
    res
      .cookie('refreshToken', refreshTokenResponse, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 5 * 60 * 1000),
      })
      .cookie('accessToken',accessTokenResponse, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      }).json(message)
  }
}
