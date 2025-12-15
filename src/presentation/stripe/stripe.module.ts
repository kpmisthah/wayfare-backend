import { DynamicModule, Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeWebhookUsecase } from '../../application/usecases/stripe/implementation/webhook.usecase';
import { BookingModule } from '../booking/booking.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      controllers: [StripeController],
      imports: [ConfigModule.forRoot(), BookingModule, WalletModule],
      providers: [
        // StripeUseCase,
        StripeWebhookUsecase,
        {
          provide: 'STRIPE_SECRET_KEY',
          useFactory: (configService: ConfigService): string | undefined =>
            configService.get('STRIPE_SECRET_KEY'),
          inject: [ConfigService],
        },
        {
          provide: 'STRIPE_WEBHOOK_SECRET',
          useFactory: (configService: ConfigService): string | undefined =>
            configService.get<string>('STRIPE_WEBHOOK_SECRET'),
          inject: [ConfigService],
        },
      ],
    };
  }
}
