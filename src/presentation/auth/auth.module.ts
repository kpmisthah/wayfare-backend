import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from 'src/application/usecases/auth/implementation/auth.usecase';
import { AccessTokenStrategy } from 'src/infrastructure/common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/infrastructure/common/strategies/refreshToken.strategy';
import { UsersModule } from '../users/users.module';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { RefreshTokenGuard } from 'src/infrastructure/common/guard/refreshToken.guard';
import { OtpModule } from '../otp/otp.module';
// import { GoogleStrategy } from 'src/application/usecases/auth/strategies/google.strategy';
import { UserService } from 'src/application/usecases/users/implementation/users.usecase';
import { JwtTokenFactory } from 'src/application/usecases/auth/implementation/jwt-token.factory';
import { AgencyService } from 'src/application/usecases/agency/implementation/agency.usecase';

@Module({
  imports: [JwtModule.register({ global: true }), UsersModule, OtpModule],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IAgencyService',
      useClass: AgencyService,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
    // GoogleStrategy,
    JwtTokenFactory,
  ],
})
export class AuthModule {}
