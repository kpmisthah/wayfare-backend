import { Package } from "@prisma/client";
import { PackageDto } from "src/application/dtos/add-package.dto";
import { PackageEntity } from "src/domain/entities/package.entity";

export interface IAgencyPackageRepository{
    addPackages(packages:PackageEntity):Promise<PackageEntity>
    getPackages():Promise<PackageEntity[]>
    findByAgencyId(agencyId):Promise<PackageEntity[]>   
}