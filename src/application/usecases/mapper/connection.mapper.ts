import { ConnectionDto } from 'src/application/dtos/connection.dto';
import { ResponseConnectionDto } from 'src/application/dtos/response-connection.dto';
import { ConnectionEntity } from 'src/domain/entities/connection.entity';

export class ConnectionMapper {
  static toConnectionDto(connectionEntity: ConnectionEntity): ConnectionDto {
    return {
      id: connectionEntity.id,
      name: connectionEntity.senderName ?? '',
      type: 'connection_request',
      status: connectionEntity.status as string,
      profileImage: connectionEntity.profileImage ?? '',
    };
  }

  static toConnectionsDto(
    connectionEntities: ConnectionEntity[],
  ): ConnectionDto[] {
    return connectionEntities.map((connection) => {
      return ConnectionMapper.toConnectionDto(connection);
    });
  }

  static mappedConnection(connection:ConnectionEntity):ResponseConnectionDto{
    return{
      id:connection.id,
      senderId:connection.senderId,
      receieverId:connection.receiverId,
      status:connection.status ?? ''
    }
  }
}
