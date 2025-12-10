import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { AiTripEntity } from 'src/domain/entities/ai.trip.entity';
import { TripMapper } from 'src/infrastructure/mappers/trip.mapper';
import { BaseRepository } from '../base.repository';
import { ITripRepository } from 'src/domain/repositories/trip/trip.repository.interface';

@Injectable()
export class TripRepository
  extends BaseRepository<AiTripEntity>
  implements ITripRepository {
  constructor(private _prisma: PrismaService) {
    super(_prisma.tripPlan, TripMapper);
  }

  async createAiTrip(data: AiTripEntity): Promise<AiTripEntity> {
    console.log(data, 'from ai trip entity');

    const createPlan = await this._prisma.tripPlan.create({
      data: TripMapper.toPrisma(data),
    });
    return TripMapper.toDomain(createPlan);
  }

  async findByUserId(userId: string): Promise<AiTripEntity[]> {
    const result = await this._prisma.tripPlan.findMany({
      where: { userId },
    });
    return TripMapper.toDomainMany(result);
  }

  async findTravellersByDestination(
    destination: string,
    userId: string,
  ): Promise<AiTripEntity[]> {
    const result = await this._prisma.tripPlan.findMany({
      where: { destination, visibility: true, userId: { not: userId } },
      take: 6,
    });
    return TripMapper.toDomainMany(result);
  }

  async findDestinationByUserId(userId: string): Promise<string[]> {
    const destination = await this._prisma.tripPlan.findMany({
      where: { userId },
    });
    return destination.map((dst) => dst.destination);
  }
  async findTravellersByDestinations(
    destinations: string[],
    userId: string,
  ): Promise<AiTripEntity[]> {
    // Build OR conditions for partial destination matching
    // This allows "Goa" to match "Goa, India" and vice versa
    const destinationConditions = destinations.map((dest) => {
      // Extract the main destination name (before any comma)
      const mainDestination = dest.split(',')[0].trim();
      return {
        destination: {
          contains: mainDestination,
          mode: 'insensitive' as const,
        },
      };
    });

    const travellers = await this._prisma.tripPlan.findMany({
      where: {
        OR: destinationConditions,
        visibility: true,
        userId: { not: userId },
        user: {
          NOT: {
            OR: [
              {
                connectionsSent: {
                  some: { receiverId: userId },
                },
              },
              {
                connectionsReceived: {
                  some: { senderId: userId },
                },
              },
            ],
          },
        },
      },
      distinct: ['userId'], 
      orderBy: {
        startDate: 'desc',
      },
      include: {
        user: {
          include: {
            userProfile: true,
          },
        },
      },
    });
    return TripMapper.toTravellersDomain(travellers);
  }
}
