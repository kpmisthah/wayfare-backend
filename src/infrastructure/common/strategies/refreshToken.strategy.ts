import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IUserUsecase } from 'src/application/usecases/users/interfaces/user.usecase.interface';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('IUserService')
    private readonly userService: IUserUsecase,
  ) {
    console.log('refreshToken');
    const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refreshToken || null,
      ]),
      secretOrKey: refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log(payload, 'paypatti');

    const refreshToken = req?.cookies?.refreshToken;
    console.log(refreshToken, 'refreshToken');

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const user = await this.userService.findById(payload.sub);

    console.log(user, 'User frk access');
    if (!user || user.isBlock) {
      throw new UnauthorizedException('Invalid refresh token or user blocked');
    }

    const isRefreshTokenValid = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    console.log(isRefreshTokenValid, 'REfresh token validation');

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return {
      userId: user.id,
      role: user.role,
      refreshToken,
    };
  }
}
