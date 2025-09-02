import { IAgencyPackageRepository } from "src/domain/repositories/agency/agency-package.repository";
import { PrismaService } from "../../prisma.service";
import { Injectable } from "@nestjs/common";
import { PackageEntity } from "src/domain/entities/package.entity";
import { PackageMapper } from "src/infrastructure/mappers/package.mapper";

@Injectable()
export class AgencyPackageRepository implements IAgencyPackageRepository{
    constructor(private readonly prisma:PrismaService){}
    async addPackages(packages:PackageEntity):Promise<PackageEntity>{
        console.log(packages,'packages in agency packager repo');
        let createPackage = await this.prisma.package.create({
            data:PackageMapper.toPrisma(packages)
        })
        return PackageMapper.toDomain(createPackage)
    }

    async getPackages():Promise<PackageEntity[]>{
        let getPackages = await this.prisma.package.findMany()
        return PackageMapper.toDomains(getPackages)
    }

    async findByAgencyId(agencyId):Promise<PackageEntity[]>{
        let getAgencyPackages = await this.prisma.package.findMany({
            where:{agencyId}
        })
        return PackageMapper.toDomains(getAgencyPackages)
    }

}