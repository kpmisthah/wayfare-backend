import {Package, Prisma } from "@prisma/client";
import { PackageEntity } from "src/domain/entities/package.entity";
import { PackageStatus } from "src/domain/enums/package-status.enum";

export class PackageMapper {
    static toDomain(pkg:Package):PackageEntity{
        return new PackageEntity(
            pkg.id,
            pkg.agencyId,
            pkg.itineraryName??"",
            pkg.description??"",
            pkg.highlights??"",
            pkg.picture,
            pkg.duration??"",
            pkg.destination??"",
            pkg.status as PackageStatus,
            pkg.price
        )
    }

    static toPrisma(packageEntity:PackageEntity):Prisma.PackageCreateInput{
        return {
            agency:{connect:{id:packageEntity.agencyId}},
            itineraryName:packageEntity.itineraryName,
            description:packageEntity.description,
            highlights:packageEntity.highlights,
            picture:packageEntity.picture,
            duration:packageEntity.duration,
            destination:packageEntity.destination,
            status:packageEntity.status,
            price:packageEntity.price
        }
    }
    static toDomains(pkg:Package[]):PackageEntity[]{
        return pkg.map((pkg)=>{
            return PackageMapper.toDomain(pkg)
        })
    }
}