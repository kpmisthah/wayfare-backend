import { ConnectionEntity } from 'src/domain/entities/connection.entity';
import { IBaseRepository } from '../base.repository';

export interface IConnectionRepository
  extends IBaseRepository<ConnectionEntity> {
  //   createConnection(data: ConnectionEntity): Promise<ConnectionEntity>;
  //   updateStatus(id: string, status: string): Promise<ConnectionEntity>;
  findConnection(
    senderId: string,
    receiverId: string,
  ): Promise<ConnectionEntity | null>;
  //   findById(id: string): Promise<ConnectionEntity | null>;
  getUserConnection(userId: string): Promise<ConnectionEntity[]>;
  findAcceptedConnections(userId: string);
}
