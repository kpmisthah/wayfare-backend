import { Package, Prisma, Transportation } from '@prisma/client';
import { PackageEntity } from 'src/domain/entities/package.entity';
import { PackageStatus } from 'src/domain/enums/package-status.enum';
import { TransportationMapper } from './transportation.mapper';

export class PackageMapper {
  static toDomain(
    pkg: Package & { transportation: Transportation | null },
  ): PackageEntity {
    return new PackageEntity(
      pkg.id,
      pkg.agencyId,
      pkg.itineraryName ?? '',
      pkg.description ?? '',
      pkg.highlights ?? '',
      pkg.picture,
      pkg.duration ?? 0,
      pkg.destination ?? '',
      pkg.status as PackageStatus,
      pkg.price,
      pkg.transportationId ?? ''
    );
  }

  static toPrisma(packageEntity: PackageEntity): Prisma.PackageCreateInput {
    return {
      agency: { connect: { id: packageEntity.agencyId } },
      itineraryName: packageEntity.itineraryName,
      description: packageEntity.description,
      highlights: packageEntity.highlights,
      picture: packageEntity.picture,
      duration: packageEntity.duration,
      destination: packageEntity.destination,
      status: packageEntity.status,
      price: packageEntity.price,
      transportation: { connect: { id: packageEntity.transportationId } },
    };
  }
  static toDomains(
    pkg: (Package & { transportation: Transportation | null })[],
  ): PackageEntity[] {
    return pkg.map((pkg) => {
      return PackageMapper.toDomain(pkg);
    });
  }

  static toPackageEntity(pkg: Package): PackageEntity {
    return new PackageEntity(
      pkg.id,
      pkg.agencyId,
      pkg.itineraryName ?? '',
      pkg.description ?? '',
      pkg.highlights ?? '',
      pkg.picture,
      pkg.duration ?? 0,
      pkg.destination ?? '',
      pkg.status as PackageStatus,
      pkg.price,
      pkg.transportationId ?? '',
    );
  }

  static toPackageEntities(pkg: Package[]): PackageEntity[] {
    return pkg.map((pkg) => {
      return PackageMapper.toPackageEntity(pkg);
    });
  }
}
