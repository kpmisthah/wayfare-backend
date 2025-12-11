import { forwardRef, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationUsecase } from 'src/application/usecases/notification/implementation/notification.usecase';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [forwardRef(() => ChatModule)],
  controllers: [NotificationController],
  providers: [
    {
      provide: 'INotificationUsecase',
      useClass: NotificationUsecase,
    },
  ],
  exports: ['INotificationUsecase'],
})
export class NotificationModule {}
