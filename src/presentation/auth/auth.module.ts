import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from '../../application/usecases/auth/implementation/auth.usecase';
import { AccessTokenStrategy } from '../../infrastructure/common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../../infrastructure/common/strategies/refreshToken.strategy';
import { UsersModule } from '../users/users.module';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RefreshTokenGuard } from '../../infrastructure/common/guard/refreshToken.guard';
import { OtpModule } from '../otp/otp.module';
// import { GoogleStrategy } from '../../application/usecases/auth/strategies/google.strategy';
import { UserService } from '../../application/usecases/users/implementation/users.usecase';
import { JwtTokenFactory } from '../../application/usecases/auth/implementation/jwt-token.factory';
import { GoogleLoginUseCase } from '../../application/usecases/auth/implementation/google-login.usecase';
import { AgencyModule } from '../agency/agency.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    UsersModule,
    OtpModule,
    AgencyModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IGoogleLoginUsecase',
      useClass: GoogleLoginUseCase,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    // {
    //   provide: 'IAgencyService',
    //   useClass: AgencyService,
    // },
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
    // GoogleStrategy,
    JwtTokenFactory,
  ],
})
export class AuthModule {}
