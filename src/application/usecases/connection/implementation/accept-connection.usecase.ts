import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IConnectionRepository } from 'src/domain/repositories/connection/connection.repository';
import { IAcceptConnection } from '../interfaces/accept-connection.interface';
import { IConversationUsecase } from '../../conversation/interfaces/conversation.interface';
import { ChatGateway } from 'src/presentation/chat/chat.gateway';

@Injectable()
export class AcceptConnectionUseCase implements IAcceptConnection {
  constructor(
    @Inject('IConnectionRepository')
    private readonly _connectionRepo: IConnectionRepository,
    @Inject('IConversationUseCase')
    private readonly _conversationUsecase: IConversationUsecase,
    private readonly _chatGateWay: ChatGateway,
  ) {}

  async execute(id: string) {
    const connection = await this._connectionRepo.findById(id);
    console.log(connection, 'connection in accept-connectino.usecase');
    if (!connection) throw new NotFoundException('Connection not found');
    const connectionUpdate = connection.update({ status: 'ACCEPTED' });
    await this._connectionRepo.update(id, connectionUpdate);
    const conversation = await this._conversationUsecase.execute(
      connection.senderId,
      connection.receiverId,
    );
    (this._chatGateWay as any).notifyConnectionAccepted(connection.senderId, {
      conversationId: conversation.id,
      accepterName: connection.recieverName,
    });
    console.log(conversation, 'conversation room created when click accpet');
    return {
      message: 'Connection accepted',
      conversationId: conversation.id,
    };
  }
}
