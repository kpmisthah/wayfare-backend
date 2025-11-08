import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { AgencyMapper } from 'src/infrastructure/mappers/agency.mapper';
import { BaseRepository } from '../base.repository';

@Injectable()
export class AgencyRepository
  extends BaseRepository<AgencyEntity>
  implements IAgencyRepository
{
  constructor(private readonly prisma: PrismaService) {
    super(prisma.agency, AgencyMapper);
  }

  async findByEmail(email: string): Promise<AgencyEntity | null> {
    const agency = await this.prisma.agency.findFirst({
      where: {
        user: {
          email: email,
        },
      },
    });
    if (!agency) {
      return null;
    }
    return AgencyMapper.toDomain(agency);
  }

  // async create(agency:AgencyEntity): Promise<AgencyEntity | null> {
  //   let createAgency =  await this.prisma.agency.create({
  //     data: AgencyMapper.toPrisma(agency)
  //   })
  //   return AgencyMapper.toDomain(createAgency)
  // }

  async findAll(): Promise<AgencyEntity[] | null> {
    const agency = await this.prisma.agency.findMany();
    console.log(agency, 'agency in repo getAllAgencies');
    if (!agency) {
      return null;
    }
    return AgencyMapper.toProfile(agency);
  }

  async findAlls(skip = 0, limit = 6): Promise<AgencyEntity[] | null> {
    const agency = await this.prisma.agency.findMany({
      skip,
      take: limit,
    });
    console.log(agency, 'agency in repo getAllAgencies');
    if (!agency) {
      return null;
    }
    return AgencyMapper.toProfile(agency);
  }
  async count(): Promise<number> {
    return this.prisma.agency.count();
  }

  async updateStatus(id: string, isVerified): Promise<AgencyEntity | null> {
    const updatedData = await this.prisma.agency.update({
      where: { userId: id },
      data: AgencyMapper.toPrisma(isVerified),
    });
    if (!updatedData) return null;
    return AgencyMapper.toDomain(updatedData);
  }

  // async findById(id: string): Promise<AgencyEntity | null> {
  //   const agency = await this.prisma.agency.findUnique({ where: { id } });
  //   if(!agency) return null
  //   return AgencyMapper.toDomain(agency);
  // }
  async findByUserId(id: string): Promise<AgencyEntity | null> {
    console.log(id, 'from agency repo findByUserId');

    const agency = await this.prisma.agency.findFirst({
      where: { userId: id },
    });

    if (!agency) {
      return null;
    }
    return AgencyMapper.toDomain(agency);
  }
}
