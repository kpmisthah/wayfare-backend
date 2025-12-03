import { ConnectionDto } from 'src/application/dtos/connection.dto';

export interface ISendConnection {
  execute(senderId: string, receiverId: string);
  getConnectionForUser(userId: string): Promise<ConnectionDto[]>;
  getAcceptedConnections(userId: string);
}
