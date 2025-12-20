import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionEntity } from '../../../../domain/entities/connection.entity';
import { IConnectionRepository } from '../../../../domain/repositories/connection/connection.repository';
import { ISendConnection } from '../interfaces/send-connection.interface';
import { ConnectionMapper } from '../../mapper/connection.mapper';
import { ConnectionDto } from '../../../dtos/connection.dto';
import { IConversationUsecase } from '../../conversation/interfaces/conversation.interface';
import { IConversationRepository } from '../../../../domain/repositories/conversation/conversation.repository.interface';
import { AcceptedConnection } from '../../../../domain/interfaces/accepted-connection.interface';
import { ChatGateway } from '../../../../presentation/chat/chat.gateway';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { INotifactionUsecase } from '../../notification/interfaces/notifcation.interface';
import { NotificationStatus } from '../../../../domain/enums/notification-status.enum';

@Injectable()
export class SendConnectionUseCase implements ISendConnection {
  constructor(
    @Inject('IConnectionRepository')
    private readonly _connectionRepo: IConnectionRepository,
    @Inject('IConversationUseCase')
    private readonly _conversationUsecase: IConversationUsecase,
    @Inject('IConversationRepository')
    private readonly _conversationRepo: IConversationRepository,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    @Inject('INotificationUsecase')
    private readonly _notificationUsecase: INotifactionUsecase,
    private readonly _chatGateway: ChatGateway,
  ) { }

  async execute(
    senderId: string,
    receiverId: string,
  ): Promise<{ message: string }> {
    const existing = await this._connectionRepo.findConnection(
      senderId,
      receiverId,
    );

    if (existing)
      throw new BadRequestException('Connection request already sent');
    const connection = ConnectionEntity.create({
      senderId,
      receiverId,
      status: 'PENDING',
    });

    const createdConnection = await this._connectionRepo.create(connection);
    const sender = await this._userRepo.findById(senderId);
    if (!sender) throw new NotFoundException('Sender not found');

    await this._notificationUsecase.createNotification(
      {
        title: 'Connection Request',
        message: `${sender.name} wants to connect with you`,
        type: NotificationStatus.CONNECTION_REQUEST,
      },
      receiverId,
    );
    this._chatGateway.notifyConnectionRequest(receiverId, {
      connectionId: createdConnection?.id ?? '',
      senderId,
      senderName: sender.name,
      senderProfileImage: sender.profileImage ?? '',
    });
    return { message: 'Connection request sent successfully' };
  }

  async getConnectionForUser(userId: string): Promise<ConnectionDto[]> {
    const connection = await this._connectionRepo.getUserConnection(userId);
    console.log(connection, 'connection');
    return ConnectionMapper.toConnectionsDto(connection);
  }
  async getAcceptedConnections(userId: string): Promise<AcceptedConnection[]> {
    console.log(userId, 'usersIddddd in getAceepted connectin');
    return await this._connectionRepo.findAcceptedConnections(userId);
  }
}
