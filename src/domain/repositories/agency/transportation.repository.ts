import { TransportationEntity } from '../../entities/transportation.entity';
import { IBaseRepository } from '../base.repository';

export interface ITransportationRepository
  extends IBaseRepository<TransportationEntity | null> {
  getTransportations(): Promise<TransportationEntity[]>;
}
