import { ConnectionDto } from 'src/application/dtos/connection.dto';

export interface AcceptedConnection {
  conversationId: string | null;
  userId: string;
  name: string | null;
  profileImage: string | null;
  type?: string;
}

export interface ISendConnection {
  execute(senderId: string, receiverId: string): Promise<{ message: string }>;
  getConnectionForUser(userId: string): Promise<ConnectionDto[]>;
  getAcceptedConnections(userId: string): Promise<AcceptedConnection[]>;
}
