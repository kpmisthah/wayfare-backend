import { IAgencyPackageRepository } from '../../../../../domain/repositories/agency/agency-package.repository';
import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';
import { PackageEntity } from '../../../../../domain/entities/package.entity';
import { PackageMapper } from '../../../../mappers/package.mapper';
import { BaseRepository } from '../base.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class AgencyPackageRepository
  extends BaseRepository<PackageEntity>
  implements IAgencyPackageRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.package, PackageMapper);
  }
  async addPackages(packages: PackageEntity): Promise<PackageEntity> {
    console.log(packages, 'packages in agency packager repo');
    const createPackage = await this._prisma.package.create({
      data: PackageMapper.toPrisma(packages),
    });
    return PackageMapper.toPackageEntity(createPackage);
  }
  async countPackages(agencyId: string, search?: string): Promise<number> {
    const where: Prisma.PackageWhereInput = { agencyId };
    if (search) {
      where.OR = [
        { destination: { contains: search, mode: 'insensitive' } },
        { itineraryName: { contains: search, mode: 'insensitive' } },
      ];
    }
    return await this._prisma.package.count({ where });
  }
  async getPackages(id: string): Promise<PackageEntity[]> {
    const getPackages = await this._prisma.package.findMany({
      where: { agencyId: id },
    });
    return PackageMapper.toPackageEntities(getPackages);
  }

  async getPackagesByPage(
    agencyId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<PackageEntity[]> {
    const skip = (page - 1) * limit;
    const where: Prisma.PackageWhereInput = { agencyId };

    if (search) {
      where.OR = [
        { destination: { contains: search, mode: 'insensitive' } },
        { itineraryName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const packages = await this._prisma.package.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return PackageMapper.toPackageEntities(packages);
  }
  async findByAgencyId(agencyId: string): Promise<PackageEntity[]> {
    const getAgencyPackages = await this._prisma.package.findMany({
      where: { agencyId },
      include: { transportation: true },
    });
    return PackageMapper.toDomains(getAgencyPackages);
  }

  async findActiveByAgencyId(agencyId: string): Promise<PackageEntity[]> {
    const getAgencyPackages = await this._prisma.package.findMany({
      where: {
        agencyId,
        status: 'ACTIVE',
        agency: {
          user: {
            isBlock: false,
          },
        },
      },
      include: { transportation: true },
    });
    return PackageMapper.toDomains(getAgencyPackages);
  }
  async findBookedPackage(agencyId: string): Promise<PackageEntity | null> {
    const bookedPackage = await this._prisma.package.findFirst({
      where: { agencyId },
    });
    if (!bookedPackage) return null;
    return PackageMapper.toPackageEntity(bookedPackage);
  }

  async filterPackages(
    destination: string,
    duration: number,
    minBudget: number,
    maxBudget: number,
  ): Promise<PackageEntity[]> {
    console.log(destination, 'destination in filt repo');
    console.log(duration, 'duration in repo');
    console.log(minBudget, 'minBudget');
    console.log(maxBudget, 'maxBudget');
    const filterPackages = await this._prisma.package.findMany({
      where: {
        destination,
        duration,
        price: {
          lte: maxBudget,
          gte: minBudget,
        },
        status: 'ACTIVE',
        agency: {
          user: {
            isBlock: false,
          },
        },
      },
    });
    console.log(filterPackages, 'filter packages');

    return PackageMapper.toPackageEntities(filterPackages);
  }

  async getAllPackages(): Promise<PackageEntity[]> {
    const fetchPackages = await this._prisma.package.findMany();
    return PackageMapper.toPackageEntities(fetchPackages);
  }

  async trendinPackages(): Promise<PackageEntity[]> {
    const trending = await this._prisma.package.findMany({
      take: 4,
      where: {
        status: 'ACTIVE',
        agency: {
          user: {
            isBlock: false,
          },
        },
      },
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
    });
    console.log(trending, 'trending in repo');
    return PackageMapper.toPackageEntities(trending);
  }
}
