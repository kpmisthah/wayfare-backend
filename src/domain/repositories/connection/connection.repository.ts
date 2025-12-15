import { ConnectionEntity } from '../../entities/connection.entity';
import { IBaseRepository } from '../base.repository';
import { AcceptedConnection } from '../../interfaces/accepted-connection.interface';

export interface IConnectionRepository
  extends IBaseRepository<ConnectionEntity> {
  findConnection(
    senderId: string,
    receiverId: string,
  ): Promise<ConnectionEntity | null>;
  getUserConnection(userId: string): Promise<ConnectionEntity[]>;
  findAcceptedConnections(userId: string): Promise<AcceptedConnection[]>;
}
