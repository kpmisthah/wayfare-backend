import { AiTripEntity } from 'src/domain/entities/ai.trip.entity';
import { IBaseRepository } from '../base.repository';

export interface ITripRepository extends IBaseRepository<AiTripEntity> {
  createAiTrip(data: AiTripEntity): Promise<AiTripEntity>;
  findByUserId(userId: string): Promise<AiTripEntity[]>;
  findTravellersByDestination(
    destination: string,
    userId: string,
  ): Promise<AiTripEntity[]>;
  findDestinationByUserId(userId: string): Promise<string[]>;
  findTravellersByDestinations(
    destinations: string[],
    userId: string,
  ): Promise<AiTripEntity[]>;
}
