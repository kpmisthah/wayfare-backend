import { $Enums, ConnectionRequest, Prisma } from '@prisma/client';
import { ConnectionEntity } from '../../domain/entities/connection.entity';

type ConnectionWithUser = Prisma.ConnectionRequestGetPayload<{
  include: {
    sender: { select: { id: true; name: true; profileImage: true } };
    receiver: { select: { id: true; name: true } };
  };
}>;

type ConnectionWithAcceptedUser = Prisma.ConnectionRequestGetPayload<{
  include: {
    sender: { select: { id: true; name: true } };
    receiver: { select: { id: true; name: true; profileImage: true } };
  };
}>;

export class ConnectionMapper {
  static toDomain(connection: ConnectionRequest): ConnectionEntity {
    return new ConnectionEntity(
      connection.id,
      connection.senderId,
      connection.receiverId,
      connection.status,
      connection.createdAt,
    );
  }
  static toPrisma(
    connection: ConnectionEntity,
  ): Prisma.ConnectionRequestCreateInput {
    return {
      sender: { connect: { id: connection.senderId } },
      receiver: { connect: { id: connection.receiverId } },
      status: connection.status as $Enums.ConnectionType,
    };
  }

  static toConnectionDomain(connection: ConnectionWithUser): ConnectionEntity {
    return new ConnectionEntity(
      connection.id,
      connection.senderId,
      connection.receiverId,
      connection.status,
      connection.createdAt,
      connection.sender.name,
      connection.receiver.name,
      connection.sender.profileImage ?? '',
    );
  }
  static toConnectDomains(
    connections: ConnectionWithUser[],
  ): ConnectionEntity[] {
    return connections.map((connections) => {
      return ConnectionMapper.toConnectionDomain(connections);
    });
  }

  static toListAcceptedConnection(
    connection: ConnectionWithAcceptedUser,
  ): ConnectionEntity {
    return new ConnectionEntity(
      connection.id,
      connection.senderId,
      connection.receiverId,
      connection.status,
      connection.createdAt,
      connection.sender.name,
      connection.receiver.name,
      connection.receiver.profileImage ?? '',
    );
  }
  static toListAcceptedConnectionsDomain(
    connections: ConnectionWithAcceptedUser[],
  ): ConnectionEntity[] {
    return connections.map((connection) => {
      return this.toListAcceptedConnection(connection);
    });
  }
}
