import { DynamicModule, Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeWebhookUsecase } from 'src/application/usecases/stripe/implementation/webhook.usecase';
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
          useFactory: async (configService: ConfigService) =>
            configService.get('STRIPE_SECRET_KEY'),
          inject: [ConfigService],
        },
        {
          provide: 'STRIPE_WEBHOOK_SECRET',
          useFactory: async (configService: ConfigService) =>
            configService.get<string>('STRIPE_WEBHOOK_SECRET'),
          inject: [ConfigService],
        },
      ],
    };
  }
}
