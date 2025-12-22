import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IConnectionRepository } from '../../../../domain/repositories/connection/connection.repository';
import { IAcceptConnection } from '../interfaces/accept-connection.interface';
import { IConversationUsecase } from '../../conversation/interfaces/conversation.interface';
import { ChatGateway } from '../../../../presentation/chat/chat.gateway';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { INotifactionUsecase } from '../../notification/interfaces/notifcation.interface';
import { NotificationStatus } from '../../../../domain/enums/notification-status.enum';
import { ConnectionMapper } from '../../mapper/connection.mapper';

@Injectable()
export class AcceptConnectionUseCase implements IAcceptConnection {
  constructor(
    @Inject('IConnectionRepository')
    private readonly _connectionRepo: IConnectionRepository,
    @Inject('IConversationUseCase')
    private readonly _conversationUsecase: IConversationUsecase,
    private readonly _chatGateWay: ChatGateway,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    @Inject('INotificationUsecase')
    private readonly _notificationUsecase: INotifactionUsecase,
  ) { }

  async execute(id: string) {
    const connection = await this._connectionRepo.findById(id);
    if (!connection) throw new NotFoundException('Connection not found');
    const mappedConnection = ConnectionMapper.mappedConnection(connection);
    const connectionUpdate = connection.update({ status: 'ACCEPTED' });

    await this._connectionRepo.update(id, connectionUpdate);
    const conversationId = await this._conversationUsecase.execute(
      connection.senderId,
      connection.receiverId,
    );

    const receiver = await this._userRepo.findById(
      mappedConnection.receieverId,
    );
    if (!receiver) throw new NotFoundException('Receiver not found');
    const n = await this._notificationUsecase.createNotification(
      {
        title: 'Connection Accepted',
        message: `${receiver.name} accepted your connection request`,
        type: NotificationStatus.ACCEPTED,
      },
      mappedConnection.senderId,
    );

    this._chatGateWay.notifyConnectionAccepted(mappedConnection.senderId, {
      accepterId: mappedConnection.receieverId,
      accepterName: receiver.name,
    });
    return {
      message: 'Connection accepted',
      conversationId,
    };
  }
}
