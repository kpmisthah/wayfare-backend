import { Injectable } from '@nestjs/common';
import { IConnectionRepository } from 'src/domain/repositories/connection/connection.repository';
import { BaseRepository } from '../base.repository';
import { ConnectionEntity } from 'src/domain/entities/connection.entity';
import { PrismaService } from '../../prisma.service';
import { ConnectionMapper } from 'src/infrastructure/mappers/connection.mapper';
import { AcceptedConnection } from 'src/domain/interfaces/accepted-connection.interface';
@Injectable()
export class ConnectionRepository
  extends BaseRepository<ConnectionEntity>
  implements IConnectionRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.connectionRequest, ConnectionMapper);
  }
  async findConnection(
    senderId: string,
    receiverId: string,
  ): Promise<ConnectionEntity | null> {
    const connection = await this._prisma.connectionRequest.findFirst({
      where: { senderId, receiverId },
    });
    if (!connection) return null;
    return ConnectionMapper.toDomain(connection);
  }

  async getUserConnection(userId: string): Promise<ConnectionEntity[]> {
    const getConnection = await this._prisma.connectionRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: { select: { id: true, name: true, profileImage: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(getConnection, 'getConnnection in connectionRepo');
    return ConnectionMapper.toConnectDomains(getConnection);
  }
  async findAcceptedConnections(userId: string): Promise<AcceptedConnection[]> {
    const connections = await this._prisma.connectionRequest.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, profileImage: true } },
        receiver: { select: { id: true, name: true, profileImage: true } },
      },
    });
    console.log(connections, 'connectionsssss');
    const conversations = await this._prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: { participants: true },
    });
    console.log(conversations, 'cnverdsattionnnssss in repo');

    const result = connections.map((conn) => {
      const otherUser = conn.senderId === userId ? conn.receiver : conn.sender;

      const conv = conversations.find((c) =>
        c.participants.some((p) => p.userId === otherUser.id),
      );

      return {
        userId: otherUser.id,
        name: otherUser.name,
        profileImage: otherUser.profileImage,
        conversationId: conv?.id || null,
        type: 'direct',
      };
    });
    console.log(result, 'in resulttt');

    return result;
  }
}
