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
    agencyId,
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
      .findMany
      // select:{
      //     phone:true,
      //     specialization:true,
      //     description:true,
      //     user:{
      //         select:{
      //             id:true,
      //             email:true,
      //             name:true
      //         }
      //     }
      // }
      ();
    if (!getAgencies) {
      return null;
    }
    return AgencyMapper.toDomainMany(getAgencies);
  }
  async findByUserId(id: string): Promise<AgencyEntity | null> {
    const agencyProfile = await this.prisma.agency.findFirst({
      where: { userId: id },
    });
    if (!agencyProfile) {
      return null;
    }
    return AgencyMapper.toDomain(agencyProfile);
  }
}
