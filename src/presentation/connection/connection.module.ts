import { forwardRef, Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { SendConnectionUseCase } from '../../application/usecases/connection/implementation/send-connection.usecase';
import { AcceptConnectionUseCase } from '../../application/usecases/connection/implementation/accept-connection.usecase';
import { RejectConnectionUseCase } from '../../application/usecases/connection/implementation/reject-connection.usecase';
import { ConversationModule } from '../conversation/conversation.module';
import { ChatModule } from '../chat/chat.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ConversationModule,
    forwardRef(() => ChatModule),
    NotificationModule,
  ],
  controllers: [ConnectionController],
  providers: [
    {
      provide: 'ISendConnectionUseCase',
      useClass: SendConnectionUseCase,
    },
    {
      provide: 'IAcceptConnectionUseCase',
      useClass: AcceptConnectionUseCase,
    },
    {
      provide: 'IRejectConnectionUseCase',
      useClass: RejectConnectionUseCase,
    },
  ],
  exports: ['ISendConnectionUseCase'],
})
export class ConnectionModule {}
