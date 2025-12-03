import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { AgencyEntity } from 'src/domain/entities/agency.entity';
import { AgencyMapper } from 'src/infrastructure/mappers/agency.mapper';
import { BaseRepository } from '../base.repository';
import { AgencyManageDto } from 'src/application/dtos/AgencyManagement.dto';

@Injectable()
export class AgencyRepository
  extends BaseRepository<AgencyEntity>
  implements IAgencyRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.agency, AgencyMapper);
  }

  async findByEmail(email: string): Promise<AgencyEntity | null> {
    const agency = await this._prisma.agency.findFirst({
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
    const agency = await this._prisma.agency.findMany();
    console.log(agency, 'agency in repo getAllAgencies');
    if (!agency) {
      return null;
    }
    return AgencyMapper.toProfile(agency);
  }

  async findAlls(
    query: string,
    orderBy: any,
    skip = 0,
    limit = 6,
  ): Promise<AgencyManageDto[] | null> {
    const agencies = await this._prisma.agency.findMany({
      where: {
        user: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      include: {
        user: true,
        package: true,
      },
      orderBy,
      skip,
      take: limit,
    });
    console.log(agencies, 'agency in repo getAllAgencies');
    if (!agencies) {
      return null;
    }
    return agencies.map((a) => AgencyMapper.fromPrisma(a));
  }
  async count(query: string): Promise<number> {
    return this._prisma.agency.count({
      where: {
        user: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    });
  }

  async updateStatus(id: string, isVerified): Promise<AgencyEntity | null> {
    const updatedData = await this._prisma.agency.update({
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
    console.log(
      id,
      '---------------------------from agency repo findByUserId------------------------------',
    );
    const agency = await this._prisma.agency.findFirst({
      where: { userId: id },
    });

    if (!agency) {
      return null;
    }
    return AgencyMapper.toDomain(agency);
  }
  async countAll(): Promise<number> {
    return await this._prisma.agency.count();
  }
}
