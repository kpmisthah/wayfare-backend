import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IUserUsecase } from '../../../application/usecases/users/interfaces/user.usecase.interface';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly _configService: ConfigService,
    @Inject('IUserService')
    private readonly _userService: IUserUsecase,
  ) {
    const refreshSecret = _configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request & { cookies: Record<string, any> }) =>
          (req?.cookies?.refreshToken as string) || null,
      ]),
      secretOrKey: refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refreshToken: string = (
      req as Request & { cookies: Record<string, any> }
    )?.cookies?.refreshToken as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const user = await this._userService.findById(payload.sub);

    if (!user || user.isBlock) {
      throw new UnauthorizedException('Invalid refresh token or user blocked');
    }

    const isRefreshTokenValid = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

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