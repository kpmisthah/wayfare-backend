import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/application/usecases/users/implementation/users.service';
import { Request } from 'express';
import { IUserService } from 'src/application/usecases/users/interfaces/user.service.interface';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.service.interface';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
import { Agency } from '@prisma/client';

type JwtPayload = {
  sub: string;
  role: 'ADMIN' | 'USER' | 'AGENCY';
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IAgencyService')
    private readonly agencyService: IAgencyService,
  ) {
    const accessSecret = configService.get<string>('JWT_ACCESS_SECRET');
    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies?.accessToken || null;
          return token;
        },
      ]),      
      secretOrKey: accessSecret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log(payload,'payload');
    
    // let user;
    // switch (payload.role) {
      // case 'USER':
        let user = await this.userService.findById(payload.sub);
        console.log(user,'user in accessToken strategy')
      //   break;

      // case 'AGENCY':
      //   user = await this.agencyService.findById(payload.sub);
      //   break;

      // case 'ADMIN':
      //   user = await this.userService.findById(payload.sub, payload.role);
      //   break;
      // default:
      //   throw new UnauthorizedException('Invalid role');
    // }
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

    // if (user.role === 'AGENCY' && user.status === AgencyStatus.PENDING) {
    //   throw new UnauthorizedException({
    //     code: 'AGENCY_PENDING',
    //     message: 'Agency account is pending approval',
    //   });
    // }

    return {
      userId: user.id,
      // username:user.name,
      role: user.role,
    };
  }
}
