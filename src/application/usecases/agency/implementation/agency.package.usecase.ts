import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PackageDto } from '../../../dtos/add-package.dto';
import { IAgencyPackageService } from '../interfaces/agency-package.interface';
import { IAgencyPackageRepository } from '../../../../domain/repositories/agency/agency-package.repository';
import { ICloudinaryService } from '../../../../domain/repositories/cloudinary/cloudinary.service.interface';
import { AGENCY_PACKAGE_TYPE } from '../../../../domain/types';
import { ItineraryEntity } from '../../../../domain/entities/itinerary.entity';
import { PackageEntity } from '../../../../domain/entities/package.entity';
import { IAgencyRepository } from '../../../../domain/repositories/agency/agency.repository.interface';
import { IItineraryRepository } from '../../../../domain/repositories/agency/itenerary.repository';
import { AgencyMapper } from '../../mapper/agency.mapper';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { PackageStatus } from '../../../../domain/enums/package-status.enum';
import { TransportationEntity } from '../../../../domain/entities/transportation.entity';
import { ITransportationRepository } from '../../../../domain/repositories/agency/transportation.repository';
import { FilterPackageDto } from '../../../dtos/filter-package.dto';
import { UpdatePackageDto } from '../../../dtos/update-package.dto';
import { PackageMapper } from '../../mapper/package.mapper';
import { TrendingDestinationDto } from '../../../dtos/trending-destination.dto';

@Injectable()
export class AgencyPackageService implements IAgencyPackageService {
  constructor(
    @Inject(AGENCY_PACKAGE_TYPE.IAgencyPackageRepository)
    private readonly _agencyPackageRepo: IAgencyPackageRepository,
    @Inject('ICloudinaryService')
    private readonly _cloudinaryService: ICloudinaryService,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
    @Inject('IIteneraryRepository')
    private readonly _iteneraryRepo: IItineraryRepository,
    @Inject('IUserService')
    private readonly _userRepo: IUserRepository,
    @Inject('ITransportationRepository')
    private readonly _transportationRepo: ITransportationRepository,
  ) { }
  async addPackages(
    addPackageDto: PackageDto,
    userId: string,
    files: Express.Multer.File[],
  ): Promise<PackageDto | null> {
    console.log(addPackageDto, 'addPackageDtooo');
    console.log(files, 'filesssss');
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const imageUrl = await this._cloudinaryService.uploadImage(file);
      console.log(
        '-------------------------------------',
        imageUrl,
        '-------------------------------',
      );
      uploadedUrls.push(imageUrl);
    }
    console.log(
      uploadedUrls,
      '---------------------uploadImageUrls--------------------------------',
    );
    const existingAgency = await this._agencyRepo.findByUserId(userId);
    console.log(existingAgency, 'exisitng agency');

    if (!existingAgency) {
      return null;
    }

    // Check if the agency's user is verified by admin
    const user = await this._userRepo.findById(userId);
    if (!user || !user.isVerified) {
      throw new ForbiddenException(
        'Your agency is not verified yet. Please wait for admin approval before adding packages.',
      );
    }
    const createTransport = TransportationEntity.create({
      vehicle: addPackageDto.vehicle,
      pickup_point: addPackageDto.pickup_point,
      drop_point: addPackageDto.drop_point,
      details: addPackageDto.details,
    });
    console.log(
      createTransport,
      '---------------createTransporttt---------------------------',
    );

    const transportaionEntity =
      await this._transportationRepo.create(createTransport);
    console.log(transportaionEntity, 'transportationEntityyy');

    if (!transportaionEntity) {
      return null;
    }

    const createPackage = PackageEntity.create({
      agencyId: existingAgency.id,
      itineraryName: addPackageDto.title,
      description: addPackageDto.description,
      highlights: addPackageDto.highlights,
      picture: uploadedUrls,
      duration: Number(addPackageDto.duration),
      destination: addPackageDto.destination,
      status: PackageStatus.ACTIVE,
      price: Number(addPackageDto.price),
      transportationId: transportaionEntity.id,
      // transportationEntity:transportaionEntity
    });
    const savePackage =
      await this._agencyPackageRepo.addPackages(createPackage);
    console.log(savePackage, 'savePacakge');

    if (!savePackage) {
      return null;
    }
    const itinerary = addPackageDto.itinerary.map((it) => {
      return ItineraryEntity.create({
        day: it.day,
        activities: it.activities,
        meals: it.meals,
        accommodation: it.accommodation,
        packageId: savePackage.id,
      });
    });

    console.log(
      itinerary,
      'create itenerary.create for agency package service',
    );

    const saveItinerary = await Promise.all(
      itinerary.map((it) => this._iteneraryRepo.create(it)),
    );
    if (!saveItinerary) {
      return null;
    }
    console.log(saveItinerary, 'saveeeItinnerrraaryy');

    const a = AgencyMapper.toPackageDto(
      savePackage,
      saveItinerary,
      transportaionEntity,
    );
    console.log(a, 'aaaa');
    return a;
  }

  async getPackages(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    items: PackageDto[];
    page: number;
    totalPages: number;
    total: number;
  } | null> {
    const agency = await this._agencyRepo.findByUserId(userId);
    console.log(agency, 'agency');
    if (!agency) return { items: [], page: 1, totalPages: 1, total: 0 };
    const total = await this._agencyPackageRepo.countPackages(
      agency.id,
      search,
    );
    const packages = await this._agencyPackageRepo.getPackagesByPage(
      agency.id,
      page,
      limit,
      search,
    );
    console.log(packages, 'packages');
    const iteneraries = await this._iteneraryRepo.getIteneraries();
    if (!iteneraries) return null;
    const items = AgencyMapper.toListPackages(packages, iteneraries);
    console.log(items, 'itemssss');
    return {
      items,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    };
  }

  async getAgencyPackages(userId: string): Promise<PackageDto[] | null> {
    const getAgencies = await this._agencyRepo.findByUserId(userId);
    const packages = await this._agencyPackageRepo.findByAgencyId(
      getAgencies?.id,
    );
    const specificPackage = packages.find((pkg) => pkg.id == getAgencies?.id);
    if (!specificPackage) return null;
    const itineraries = await this._iteneraryRepo.findByItenerary(
      specificPackage?.id,
    );
    if (!itineraries) return null;
    if (!packages) return null;
    return AgencyMapper.toListPackages(packages, itineraries);
  }

  async getPackagesByAgencyId(
    agencyId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: PackageDto[]; total: number; totalPages: number }> {
    console.log(agencyId, 'agencyidddddd');

    let getPackages =
      await this._agencyPackageRepo.findActiveByAgencyId(agencyId);
    console.log(
      getPackages,
      '----------------->>>>>getPakcagesss,,,,,,,,,,,,--',
    );

    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      getPackages = getPackages.filter(
        (pkg) =>
          pkg.itineraryName?.toLowerCase().includes(searchLower) ||
          pkg.destination?.toLowerCase().includes(searchLower) ||
          pkg.description?.toLowerCase().includes(searchLower),
      );
    }

    const total = getPackages.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const slicedPackages = getPackages.slice(start, end);
    const iteneraries = await Promise.all(
      slicedPackages.map((pkg) => this._iteneraryRepo.findByItenerary(pkg.id)),
    );
    console.log(iteneraries);

    const allItineraries = iteneraries.flat();
    const mappedAgencies = AgencyMapper.toListPackages(
      slicedPackages,
      allItineraries,
    );
    console.log(mappedAgencies, 'mapped agencies');

    return {
      data: mappedAgencies,
      total,
      totalPages,
    };
  }

  async getPackageDetails(packageId: string): Promise<PackageDto | null> {
    const pack = await this._agencyPackageRepo.findById(packageId);
    console.log(pack, '<==============pack======================>');
    if (!pack) return null;
    const trans = await this._transportationRepo.findById(
      pack.transportationId,
    );
    console.log(trans, '[[[[[[[[[[[[[[[[[[[[[trns]]]]]]]]]]]]]]]]]]]]');
    const itinerary =
      (await this._iteneraryRepo.findByItenerary(pack.id)) ?? [];
    console.log(itinerary, 'itinerary');

    return AgencyMapper.toPackageDto(pack, itinerary, trans ?? undefined);
  }

  async filterPackages(filterPackages: FilterPackageDto): Promise<{
    data: PackageDto[];
    total: number;
    page: number;
    totalPages: number;
  } | null> {
    const startDate = new Date(filterPackages.startDate);
    const endDate = new Date(filterPackages.endDate);
    const start = startDate.getTime();
    const end = endDate.getTime();
    const timeDifference = end - start;
    const duration = timeDifference / (1000 * 3600 * 24);
    const minPricePerPerson =
      filterPackages.minBudget / filterPackages.travelers;
    const maxPricePerPerson =
      filterPackages.maxBudget / filterPackages.travelers;

    let packageRepo = await this._agencyPackageRepo.filterPackages(
      filterPackages.destination,
      duration,
      minPricePerPerson,
      maxPricePerPerson,
    );
    if (filterPackages.search && filterPackages.search.trim()) {
      const searchLower = filterPackages.search.toLowerCase();
      packageRepo = packageRepo.filter(
        (pkg) =>
          pkg.itineraryName?.toLowerCase().includes(searchLower) ||
          pkg.destination?.toLowerCase().includes(searchLower) ||
          pkg.description?.toLowerCase().includes(searchLower),
      );
    }
    if (
      filterPackages.durationFilter &&
      filterPackages.durationFilter !== 'all'
    ) {
      packageRepo = packageRepo.filter((pkg) => {
        if (filterPackages.durationFilter === 'short') {
          return pkg.duration <= 3;
        } else if (filterPackages.durationFilter === 'medium') {
          return pkg.duration > 3 && pkg.duration <= 7;
        } else if (filterPackages.durationFilter === 'long') {
          return pkg.duration > 7;
        }
        return true;
      });
    }

    const iteneraries = await this._iteneraryRepo.getIteneraries();
    if (!iteneraries) return null;
    const transportation = await this._transportationRepo.getTransportations();

    if (filterPackages.vehicle && filterPackages.vehicle !== 'all') {
      const vehicleLower = filterPackages.vehicle.toLowerCase();
      const packageWithTransport = packageRepo.filter((pkg) => {
        const trans = transportation.find((t) => t.id === pkg.transportationId);
        return trans?.vehicle?.toLowerCase() === vehicleLower;
      });
      packageRepo = packageWithTransport;
    }

    const total = packageRepo.length;
    const page = filterPackages.page || 1;
    const limit = filterPackages.limit || 10;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPackages = packageRepo.slice(startIndex, endIndex);

    const mappedPackages = AgencyMapper.toManyPackages(
      paginatedPackages,
      iteneraries,
      transportation,
    );

    return {
      data: mappedPackages,
      total,
      page,
      totalPages,
    };
  }

  async updatePackage(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<UpdatePackageDto | null> {
    const travelpackage = await this._agencyPackageRepo.findById(id);
    if (!travelpackage) return null;
    const transportation = await this._transportationRepo.findById(
      travelpackage.transportationId,
    );
    if (!transportation) return null;
    console.log(travelpackage, 'travelPackagesss in app');

    if (!travelpackage) return null;
    const packageUpdate = travelpackage.update({
      name: updatePackageDto.title,
      destination: updatePackageDto.destination,
      description: updatePackageDto.description,
      highlights: updatePackageDto.highlights,
      duration: updatePackageDto.duration,
      picture: updatePackageDto.picture,
      price: updatePackageDto.price,
      status: updatePackageDto.status,
    });
    console.log(packageUpdate, 'in package updare app');
    const transportationUpdate = transportation.update({
      vehicle: updatePackageDto.vehicle,
      pickup_point: updatePackageDto.pickup_point,
      drop_point: updatePackageDto.drop_point,
      details: updatePackageDto.details,
    });
    const updated = await this._agencyPackageRepo.update(id, packageUpdate);
    console.log(updated, 'in package Mapper');
    if (!updated) return null;
    const updateTransportation = await this._transportationRepo.update(
      transportation.id,
      transportationUpdate,
    );
    console.log(updateTransportation);
    if (!updateTransportation) return null;
    return PackageMapper.toPackageDto(updated, updateTransportation);
  }

  async trendingPackages(): Promise<TrendingDestinationDto[]> {
    const fetchTrendingPackages =
      await this._agencyPackageRepo.trendinPackages();
    return PackageMapper.toTrendingPackageDto(fetchTrendingPackages);
  }
  async updatePackageStatus(
    id: string,
    status: PackageStatus,
  ): Promise<UpdatePackageDto | null> {
    const pkg = await this._agencyPackageRepo.findById(id);
    if (!pkg) return null;
    const transportation = await this._transportationRepo.findById(
      pkg.transportationId,
    );
    if (!transportation) return null;
    const updated = pkg.update({ status });
    console.log(updated, 'updateeddd paackage status');
    const updatedPackage = await this._agencyPackageRepo.update(id, updated);
    if (!updatedPackage) return null;
    return PackageMapper.toPackageDto(updatedPackage, transportation);
  }
}
