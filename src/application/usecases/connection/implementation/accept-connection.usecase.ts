import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IConnectionRepository } from 'src/domain/repositories/connection/connection.repository';
import { IAcceptConnection } from '../interfaces/accept-connection.interface';
import { IConversationUsecase } from '../../conversation/interfaces/conversation.interface';
import { ChatGateway } from 'src/presentation/chat/chat.gateway';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { INotifactionUsecase } from '../../notification/interfaces/notifcation.interface';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
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
  ) {}

  async execute(id: string) {
    console.log(id, 'stringgg iffd');

    const connection = await this._connectionRepo.findById(id);
    if (!connection) throw new NotFoundException('Connection not found');
    const mappedConnection = ConnectionMapper.mappedConnection(connection);
    console.log(mappedConnection, 'mapped_cinnection');
    const connectionUpdate = connection.update({ status: 'ACCEPTED' });
    console.log(connectionUpdate, 'updated connectionsss');

    await this._connectionRepo.update(id, connectionUpdate);
    const conversationId = await this._conversationUsecase.execute(
      connection.senderId,
      connection.receiverId,
    );
    console.log(
      '<<=====================>>',
      conversationId,
      '<<========================>>',
    );

    const receiver = await this._userRepo.findById(
      mappedConnection.receieverId,
    );
    if (!receiver) throw new NotFoundException('Receiver not found');
    // Create notification for the ORIGINAL SENDER
    const n = await this._notificationUsecase.createNotification(
      {
        title: 'Connection Accepted',
        message: `${receiver.name} accepted your connection request`,
        type: NotificationStatus.ACCEPTED,
      },
      mappedConnection.senderId,
    );
    console.log(n, 'in accepted connection');

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
