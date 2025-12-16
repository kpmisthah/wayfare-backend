import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenFactory {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  async generateTokens(userId: string, username: string, role: string) {
    const accessSecret = this._configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this._configService.get<string>('JWT_REFRESH_SECRET');

    const [accessToken, refreshToken] = await Promise.all([
      this._jwtService.signAsync(
        { sub: userId, username, role },
        { secret: accessSecret, expiresIn: '2h' },
      ),
      this._jwtService.signAsync(
        { sub: userId, username, role },
        { secret: refreshSecret, expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
