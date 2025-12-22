import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { IUserUsecase } from '../../../application/usecases/users/interfaces/user.usecase.interface';
import { IAgencyService } from '../../../application/usecases/agency/interfaces/agency.usecase.interface';

type JwtPayload = {
  sub: string;
  role: 'ADMIN' | 'USER' | 'AGENCY';
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly _configService: ConfigService,
    @Inject('IUserService')
    private readonly _userService: IUserUsecase,
    @Inject('IAgencyService')
    private readonly _agencyService: IAgencyService,
  ) {
    const accessSecret = _configService.get<string>('JWT_ACCESS_SECRET');
    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request & { cookies: Record<string, string> }) => {
          const token: string | null =
            (req?.cookies?.accessToken as string) || null;
          return token;
        },
      ]),
      secretOrKey: accessSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this._userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    if (user.isBlock) {
      throw new UnauthorizedException({
        code: 'USER_BLOCKED',
        message: 'User is blocked by admin',
      });
    }

    return {
      userId: user.id,
      // username:user.name,
      role: user.role,
    };
  }
}
