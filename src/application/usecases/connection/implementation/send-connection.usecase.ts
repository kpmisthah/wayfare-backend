import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConnectionEntity } from 'src/domain/entities/connection.entity';
import { IConnectionRepository } from 'src/domain/repositories/connection/connection.repository';
import { ISendConnection } from '../interfaces/send-connection.interface';
import { ConnectionMapper } from '../../mapper/connection.mapper';
import { ConnectionDto } from 'src/application/dtos/connection.dto';
import { IConversationUsecase } from '../../conversation/interfaces/conversation.interface';
import { IConversationRepository } from 'src/domain/repositories/conversation/conversation.repository.interface';
import { AcceptedConnection } from 'src/domain/interfaces/accepted-connection.interface';

@Injectable()
export class SendConnectionUseCase implements ISendConnection {
  constructor(
    @Inject('IConnectionRepository')
    private readonly _connectionRepo: IConnectionRepository,
    @Inject('IConversationUseCase')
    private readonly _conversationUsecase: IConversationUsecase,
    @Inject('IConversationRepository')
    private readonly _conversationRepo: IConversationRepository,
  ) {}

  async execute(senderId: string, receiverId: string) {
    console.log(senderId, 'sernderIdddd in application layer');
    console.log(receiverId, 'reciever iddd in appplication layer');
    const existing = await this._connectionRepo.findConnection(
      senderId,
      receiverId,
    );
    console.log(existing, 'exisitnggg');

    if (existing)
      throw new BadRequestException('Connection request already sent');
    // const connection = new ConnectionEntity({ senderId, receiverId, status: "pending" });
    const connection = ConnectionEntity.create({
      senderId,
      receiverId,
      status: 'PENDING',
    });
    console.log(connection, 'connectionEntity in connection');

    const cn = await this._connectionRepo.create(connection);
    console.log(cn, 'cnnn');
    return cn;
  }

  async getConnectionForUser(userId: string): Promise<ConnectionDto[]> {
    console.log(userId, 'athaayath aashiqnte id reciever id');
    const connection = await this._connectionRepo.getUserConnection(userId);
    console.log(connection, 'connection');
    return ConnectionMapper.toConnectionsDto(connection);
  }
  async getAcceptedConnections(userId: string): Promise<AcceptedConnection[]> {
    console.log(userId, 'usersIddddd in getAceepted connectin');
    return await this._connectionRepo.findAcceptedConnections(userId);
  }
}
