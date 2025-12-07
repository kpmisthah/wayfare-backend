import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
// import {MongodbModule} from './infrastructure/database/mongodb/mongodb.module';
import { AuthModule } from './presentation/auth/auth.module';
import { UsersModule } from './presentation/users/users.module';
import { OtpModule } from './presentation/otp/otp.module';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logging } from './infrastructure/core/custom-logger';
import { AgencyModule } from './presentation/agency/agency.module';
import { ProfileModule } from './presentation/profile/profile.module';
import { AdminModule } from './presentation/admin/admin.module';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { TripModule } from './presentation/trip/trip.module';
import { BookingModule } from './presentation/booking/booking.module';
import { StripeModule } from './presentation/stripe/stripe.module';
import { WalletModule } from './presentation/wallet/wallet.module';
import { TravellersModule } from './presentation/travellers/travellers.module';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ChatModule } from './presentation/chat/chat.module';
import { ConversationModule } from './presentation/conversation/conversation.module';
import { ConnectionModule } from './presentation/connection/connection.module';
import { PaymentModule } from './presentation/payment/payment.module';
import { RedisModule } from './infrastructure/common/redis/redis.module';
import { NotificationModule } from './presentation/notification/notification.module';

const customLogger = new Logging();
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule.forRootAsync(),
    PrismaModule,
    AuthModule,
    UsersModule,
    OtpModule,
    AgencyModule,
    ProfileModule,
    WinstonModule.forRoot(customLogger.createLoggerConfig),
    AdminModule,
    CloudinaryModule,
    TripModule,
    WalletModule,
    BookingModule,
    TravellersModule,
    ChatModule,
    ConversationModule,
    ConnectionModule,
    PaymentModule,
    RedisModule,
    NotificationModule
    // ElasticsearchModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: WINSTON_MODULE_NEST_PROVIDER,
      useValue: WinstonModule.createLogger(customLogger.createLoggerConfig),
    },
  ],
  exports: [WINSTON_MODULE_NEST_PROVIDER],
})
export class AppModule {}
