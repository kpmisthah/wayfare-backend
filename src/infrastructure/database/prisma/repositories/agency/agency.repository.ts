import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IAgencyRepository } from '../../../../../domain/repositories/agency/agency.repository.interface';
import { AgencyEntity } from '../../../../../domain/entities/agency.entity';
import { AgencyMapper } from '../../../../mappers/agency.mapper';
import { BaseRepository } from '../base.repository';
import { AgencyWithUserResult } from '../../../../../application/dtos/repository-results';
import { AgencyStatus } from '../../../../../domain/enums/agency-status.enum';
import { $Enums, Prisma } from '@prisma/client';

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
  async findAlll(): Promise<AgencyEntity[] | null> {
    const agency = await this._prisma.agency.findMany();
    if (!agency) {
      return null;
    }
    return AgencyMapper.toProfile(agency);
  }
  async findAll(options: {
    skip: number;
    take: number;
    status?: AgencyStatus;
    search?: string;
  }): Promise<{ data: AgencyEntity[]; total: number } | null> {
    const { skip, take, status, search } = options;
    const where: Prisma.AgencyWhereInput = {};
    if (status) {
      where.status = status as $Enums.AgencyStatus;
    }
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        {
          user: {
            name: { contains: search, mode: 'insensitive' },
            email: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }
    const total = await this._prisma.agency.count({ where });
    const agency = await this._prisma.agency.findMany({
      skip,
      take,
      where,
    });
    if (!agency) {
      return null;
    }
    const data = AgencyMapper.toProfile(agency);
    return { data, total };
  }

  async findAlls(
    query: string,
    orderBy: Record<string, 'asc' | 'desc'>,
    skip = 0,
    limit = 6,
  ): Promise<AgencyWithUserResult[] | null> {
    const agencies = await this._prisma.agency.findMany({
      where: {
        user: {
          isBlock: false,
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
    if (!agencies) {
      return null;
    }
    return agencies.map((a) => AgencyMapper.fromPrisma(a));
  }
  async count(query: string): Promise<number> {
    return this._prisma.agency.count({
      where: {
        user: {
          isBlock: false,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    });
  }

  async updateStatus(
    id: string,
    isVerified: AgencyEntity,
  ): Promise<AgencyEntity | null> {
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
