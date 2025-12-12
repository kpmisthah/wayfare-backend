import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IAgencyProfileRepository } from 'src/domain/repositories/agency/agency-profile.repository.interface';
import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { AgencyMapper } from 'src/infrastructure/mappers/agency.mapper';

@Injectable()
export class AgencyProfileRepository implements IAgencyProfileRepository {
  constructor(private readonly prisma: PrismaService) {}
  async updateProfile(
    updateAgencyProfile: AgencyEntity,
    agencyId: string,
  ): Promise<AgencyEntity | null> {
    const agencyProfileUpdate = await this.prisma.agency.update({
      where: { userId: agencyId },
      data: AgencyMapper.toPrisma(updateAgencyProfile),
    });
    console.log(agencyProfileUpdate, 'in agency-profile-repo');

    if (!agencyProfileUpdate) {
      return null;
    }
    return AgencyMapper.toDomain(agencyProfileUpdate);
  }

  async getAgencyProfile(): Promise<AgencyEntity[] | null> {
    const getAgencies = await this.prisma.agency
      .findMany();
    if (!getAgencies) {
      return null;
    }
    return AgencyMapper.toDomainMany(getAgencies);
  }
  async findByUserId(id: string): Promise<AgencyEntity | null> {
    const agencyProfile = await this.prisma.agency.findFirst({
      where: { userId: id },
      include: {
        user: {
          select: { bannerImage: true },
        },
      },
    });
    if (!agencyProfile) {
      return null;
    }
    return AgencyMapper.toDomain(agencyProfile);
  }
}
