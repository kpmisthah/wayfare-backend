import { PackageDto } from '../../dtos/add-package.dto';
import { AgencyProfileDto } from '../../dtos/agency-profile.dto';
import { AgencyResponseDto } from '../../dtos/agency-response.dto';
import { AgencyEntity } from '../../../domain/entities/agency.entity';
import { ItineraryEntity } from '../../../domain/entities/itinerary.entity';
import { PackageEntity } from '../../../domain/entities/package.entity';
import { TransportationEntity } from '../../../domain/entities/transportation.entity';
import { UserEntity } from '../../../domain/entities/user.entity';

export class AgencyMapper {
  static toAgencyDto(agencyEntity: AgencyEntity): AgencyResponseDto {
    return {
      description: agencyEntity.description,
      pendingPayouts: agencyEntity.pendingPayouts,
      totalEarnings: agencyEntity.totalEarnings,
      licenseNumber: agencyEntity.licenseNumber,
      ownerName: agencyEntity.ownerName,
      address: agencyEntity.address ?? '',
      websiteUrl: agencyEntity.websiteUrl,
    };
  }
  static toAgencyProfileDto(
    agencyEntity: AgencyEntity,
    userEntity: UserEntity,
  ): AgencyProfileDto {
    return {
      id: agencyEntity.id,
      description: agencyEntity.description,
      phone: userEntity.phone,
      email: userEntity.email,
      address: agencyEntity.address,
      licenseNumber: agencyEntity.licenseNumber,
      ownerName: agencyEntity.ownerName,
      websiteUrl: agencyEntity.websiteUrl,
      user: {
        name: userEntity.name,
        email: userEntity.email,
        verified: userEntity.isVerified,
        profileImage: userEntity.profileImage,
        bannerImage: userEntity.bannerImage,
      },
    };
  }
  static toAgencyManagement(
    userEntity: UserEntity,
    agencyEntity?: AgencyEntity,
  ) {
    return {
      id: agencyEntity?.id,
      address: agencyEntity?.address ?? '',
      licenseNumber: agencyEntity?.licenseNumber ?? '',
      ownerName: agencyEntity?.ownerName ?? '',
      websiteUrl: agencyEntity?.websiteUrl ?? '',
      description: agencyEntity?.description ?? '',
      // transportationId:agencyEntity?.transactionId,
      reason: agencyEntity?.reason ?? '',
      user: {
        id: userEntity.id,
        name: userEntity.name,
        email: userEntity.email,
        isVerified: userEntity.isVerified,
        image: userEntity.profileImage,
        isBlock: userEntity.isBlock,
      },
    };
  }
  static toListAgencies(
    userEntity: UserEntity[],
    agencyEntity?: AgencyEntity[] | null,
  ) {
    return userEntity.map((user) => {
      const agency = agencyEntity?.find((agency) => agency.userId == user.id);

      return AgencyMapper.toAgencyManagement(user, agency);
    });
  }
  static toPackageDto(
    packageEntity: PackageEntity,
    itineraryEntity: (ItineraryEntity | null)[],
    transportationEntity?: TransportationEntity,
  ): PackageDto {
    console.log(packageEntity, 'in application mapper');
    console.log(itineraryEntity, 'in package');
    console.log(transportationEntity, 'transportation in app mapper');

    const validation = itineraryEntity.filter((it) => it != null);
    console.log(validation, 'validaationnn');

    return {
      id: packageEntity.id,
      title: packageEntity.itineraryName,
      destination: packageEntity.destination,
      description: packageEntity.description,
      highlights: packageEntity.highlights,
      duration: packageEntity.duration,
      picture: packageEntity.picture,
      price: packageEntity.price,
      itinerary: validation.map((it) => ({
        day: it.day,
        activities: it.activities,
        meals: it.meals,
        accommodation: it.accommodation,
      })),
      status: packageEntity.status,
      vehicle: transportationEntity?.vehicle ?? '',
      pickup_point: transportationEntity?.pickup_point ?? '',
      drop_point: transportationEntity?.drop_point ?? '',
      details: transportationEntity?.details ?? '',
    };
  }
  // static toListPackages(
  //   packageEntity: PackageEntity[],
  //   itineraryEntity: (ItineraryEntity[] | null)[],
  // ): PackageDto[] {
  //   return packageEntity.map((pkg,index) => {
  //     const itnForPackage = itineraryEntity[index] ?? []
  //     return AgencyMapper.toPackageDto(
  //       pkg,
  //       itnForPackage ?? [],
  //       // pkg.transportation ?? undefined,
  //     );
  //   });
  // }

  static toManyPackages(
    packageEntity: PackageEntity[],
    itineraryEntity: ItineraryEntity[],
    transportationEntity: TransportationEntity[],
  ): PackageDto[] {
    return packageEntity.map((pkg) => {
      const itnForPackage = itineraryEntity.filter(
        (itn) => itn.packageId == pkg.id,
      );
      const transportationForPackage = transportationEntity.find(
        (trn) => trn.id == pkg.transportationId,
      );
      return AgencyMapper.toPackageDto(
        pkg,
        itnForPackage,
        transportationForPackage,
      );
    });
  }

  static toListPackages(
    packageEntity: PackageEntity[],
    itineraryEntity: (ItineraryEntity | null)[],
  ): PackageDto[] {
    return packageEntity.map((pkg) => {
      const itnForPackage = itineraryEntity?.filter(
        (it) => it?.packageId == pkg.id,
      );
      return AgencyMapper.toPackageDto(
        pkg,
        itnForPackage ?? [],
        // pkg.transportation ?? undefined,
      );
    });
  }
  static toAgency(domain: AgencyEntity, user: UserEntity) {
    console.log(user);
    return {
      id: domain.id,
      address: domain.address ?? '',
      licenseNumber: domain.licenseNumber ?? '',
      ownerName: domain.ownerName ?? '',
      websiteUrl: domain.websiteUrl ?? '',
      description: domain.description ?? '',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        image: user.profileImage,
        isBlock: user.isBlock,
      },
    };
  }

  static toList(agencyModels: { domain: AgencyEntity; user: UserEntity }[]) {
    return agencyModels.map((model) =>
      AgencyMapper.toAgency(model.domain, model.user),
    );
  }
}
