import { IAgencyPackageRepository } from 'src/domain/repositories/agency/agency-package.repository';
import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';
import { PackageEntity } from 'src/domain/entities/package.entity';
import { PackageMapper } from 'src/infrastructure/mappers/package.mapper';
import { BaseRepository } from '../base.repository';

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
  async countPackages(agencyId:string):Promise<number>{
    return await this._prisma.package.count({where:{agencyId}})
  }
  async getPackages(id: string): Promise<PackageEntity[]> {
    const getPackages = await this._prisma.package.findMany({
      where: { agencyId: id },
    });
    return PackageMapper.toPackageEntities(getPackages);
  }

  async getPackagesByPage(agencyId:string,page:number,limit:number):Promise<PackageEntity[]>{
    let skip = (page-1)*limit
    const packages = await this._prisma.package.findMany({
      where:{agencyId},
      skip,
      take:limit
    })
    return PackageMapper.toPackageEntities(packages)
  }
  async findByAgencyId(agencyId:string): Promise<PackageEntity[]> {
    const getAgencyPackages = await this._prisma.package.findMany({
      where: { agencyId },
      include: { transportation: true },
    });
    return PackageMapper.toDomains(getAgencyPackages);
  }
  async findBookedPackage(agencyId:string):Promise<PackageEntity|null>{
    let bookedPackage = await this._prisma.package.findFirst({
      where:{agencyId}
    })
    if(!bookedPackage) return null
    return PackageMapper.toPackageEntity(bookedPackage)
  }

  async filterPackages(destination:string,duration:number,minBudget:number,maxBudget:number):Promise<PackageEntity[]>{
    console.log(destination,'destination in filt repo');
    console.log(duration,'duration in repo');
    console.log(minBudget,'minBudget');
    console.log(maxBudget,'maxBudget');
    const filterPackages = await this._prisma.package.findMany({
      where:{
        destination,
        duration,
        price:{
          lte:maxBudget,
          gte:minBudget,
        }
      }
    })
    console.log(filterPackages,'filter packages');
    
    return PackageMapper.toPackageEntities(filterPackages)
  }

  async getAllPackages():Promise<PackageEntity[]>{
    let fetchPackages = await this._prisma.package.findMany()
    return PackageMapper.toPackageEntities(fetchPackages)
  }

}
