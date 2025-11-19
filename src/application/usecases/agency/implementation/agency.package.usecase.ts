import { Inject, Injectable } from '@nestjs/common';
import { PackageDto } from 'src/application/dtos/add-package.dto';
import { IAgencyPackageService } from 'src/application/usecases/agency/interfaces/agency-package.interface';
import { IAgencyPackageRepository } from 'src/domain/repositories/agency/agency-package.repository';
import { ICloudinaryService } from 'src/domain/repositories/cloudinary/cloudinary.service.interface';
import { AGENCY_PACKAGE_TYPE } from 'src/domain/types';
import { ItineraryEntity } from 'src/domain/entities/itinerary.entity';
import { PackageEntity } from 'src/domain/entities/package.entity';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { IItineraryRepository } from 'src/domain/repositories/agency/itenerary.repository';
import { AgencyMapper } from 'src/application/usecases/mapper/agency.mapper';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { PackageStatus } from 'src/domain/enums/package-status.enum';
import { TransportationEntity } from 'src/domain/entities/transportation.entity';
import { ITransportationRepository } from 'src/domain/repositories/agency/transportation.repository';
import { FilterPackageDto } from 'src/application/dtos/filter-package.dto';
import { UpdatePackageDto } from 'src/application/dtos/update-package.dto';
import { PackageMapper } from '../../mapper/package.mapper';


@Injectable()
export class AgencyPackageService implements IAgencyPackageService {
  constructor(
    @Inject(AGENCY_PACKAGE_TYPE.IAgencyPackageRepository)
    private readonly _agencyPackageRepo: IAgencyPackageRepository,
    @Inject('ICloudinaryService')
    private readonly _cloudinaryService: ICloudinaryService,
    @Inject('IAgencyRepository')
    private readonly agencyRepo: IAgencyRepository,
    @Inject('IIteneraryRepository')
    private readonly _iteneraryRepo: IItineraryRepository,
    @Inject('IUserService')
    private readonly _userRepo: IUserRepository,
    @Inject('ITransportationRepository')
    private readonly _transportationRepo: ITransportationRepository,
  ) {}
  async addPackages(
    addPackageDto: PackageDto,
    userId: string,
    files: Express.Multer.File[],
  ): Promise<PackageDto | null> {
    console.log(addPackageDto,'addPackageDtooo')
    console.log(files,'filesssss');
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const imageUrl = await this._cloudinaryService.uploadImage(file);
      console.log('-------------------------------------',imageUrl,'-------------------------------');
      uploadedUrls.push(imageUrl);
    }
    console.log(uploadedUrls,'---------------------uploadImageUrls--------------------------------')
    const existingAgency = await this.agencyRepo.findByUserId(userId);
    console.log(existingAgency, 'exisitng agency');

    if (!existingAgency) {
      return null;
    }
    const createTransport = TransportationEntity.create({
      vehicle: addPackageDto.vehicle,
      pickup_point: addPackageDto.pickup_point,
      drop_point: addPackageDto.drop_point,
      details: addPackageDto.details,
    });
    console.log(createTransport,'---------------createTransporttt---------------------------');
    
    const transportaionEntity =
      await this._transportationRepo.create(createTransport);
      console.log(transportaionEntity,'transportationEntityyy');
      
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
      status: PackageStatus.INACTIVE,
      price: Number(addPackageDto.price),
      transportationId: transportaionEntity.id
      // transportationEntity:transportaionEntity
    });
    const savePackage = await this._agencyPackageRepo.addPackages(createPackage);
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

    let a = AgencyMapper.toPackageDto(
      savePackage,
      saveItinerary,
      transportaionEntity,
    );
    console.log(a,'aaaa')
    return a
  }

  async getPackages(userId: string,page:number,limit:number): Promise<{items:PackageDto[],page:number,totalPages:number,total:number}|null> {
    const agency = await this.agencyRepo.findByUserId(userId);
    if (!agency) return {items:[],page:1,totalPages:1,total:0};
    const total = await this._agencyPackageRepo.countPackages(agency.id)
    const packages = await this._agencyPackageRepo.getPackagesByPage(agency.id,page,limit);
    const iteneraries = await this._iteneraryRepo.getIteneraries();
    if (!iteneraries) return null;
    let items = AgencyMapper.toListPackages(packages, iteneraries);
    return{
      items,
      page,
      totalPages:Math.ceil(total/limit),
      total
    }
  }

  async getAgencyPackages(userId: string): Promise<PackageDto[] | null> {
    const getAgencies = await this.agencyRepo.findByUserId(userId);
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

  async getPackagesByAgencyId(agencyId: string,page:number,limit:number): Promise<{data:PackageDto[],total:number,totalPages:number} > {
    const getPackages = await this._agencyPackageRepo.findByAgencyId(agencyId);
    const total = getPackages.length  
    const totalPages = Math.ceil(total/limit)
    const start = (page-1)*limit
    const end = start+limit
    const slicedPackages = getPackages.slice(start,end)    
    const iteneraries = await Promise.all(
      slicedPackages.map((pkg) => this._iteneraryRepo.findByItenerary(pkg.id)),
    );
    console.log(iteneraries);
    
    const allItineraries = iteneraries.flat();
    const mappedAgencies = AgencyMapper.toListPackages(slicedPackages, allItineraries);
    console.log(mappedAgencies,'mapped agencies');
    
    return {
      data:mappedAgencies,
      total,
      totalPages,
    }
  }

  async getPackageDetails(packageId: string): Promise<PackageDto | null> {
    const pack = await this._agencyPackageRepo.findById(packageId);
    console.log(pack, 'pack');
    if (!pack) return null;
    const trans = await this._transportationRepo.findById(
      pack.transportationId,
    );
    console.log(trans, 'trns');
    const itinerary = (await this._iteneraryRepo.findByItenerary(pack.id)) ?? [];
    console.log(itinerary, 'itinerary');

    return AgencyMapper.toPackageDto(pack, itinerary, trans ?? undefined);
  }

  async filterPackages(filterPackages:FilterPackageDto):Promise<PackageDto[]|null>{
    let startDate = new Date(filterPackages.startDate)
    let endDate = new Date(filterPackages.endDate)
    let start = startDate.getTime()
    let end = endDate.getTime()
    let timeDifference = end - start
    let duration =  timeDifference/ (1000 * 3600 * 24);
    let minPricePerPerson = filterPackages.minBudget/filterPackages.travelers
    let maxPricePerPerson = filterPackages.maxBudget/filterPackages.travelers
    let packageRepo = await this._agencyPackageRepo.filterPackages(filterPackages.destination,duration,minPricePerPerson,maxPricePerPerson)
    const iteneraries = await this._iteneraryRepo.getIteneraries()
    if(!iteneraries) return null
    let transportation = await this._transportationRepo.getTransportations()
    return AgencyMapper.toManyPackages(packageRepo,iteneraries,transportation)
  }

  async updatePackage(id:string,updatePackageDto:UpdatePackageDto):Promise<UpdatePackageDto|null>{
    let travelpackage = await this._agencyPackageRepo.findById(id)
    if(!travelpackage) return null
    let transportation = await this._transportationRepo.findById(travelpackage.transportationId)
    if(!transportation) return null
    console.log(travelpackage,'travelPackagesss in app');
    
    if(!travelpackage) return null
    let packageUpdate = travelpackage.update({
      name:updatePackageDto.title,
      destination:updatePackageDto.destination,
      description:updatePackageDto.description,
      highlights:updatePackageDto.highlights,
      duration:updatePackageDto.duration,
      picture:updatePackageDto.picture,
      price:updatePackageDto.price,
      // vehicle:updatePackageDto.vehicle,
      // pickup_point:updatePackageDto.pickup_point,
      // drop_point:updatePackageDto.drop_point,
      // detail:updatePackageDto.detail,
      status:updatePackageDto.status
    })
    console.log(packageUpdate,'in package updare app')
    let transportationUpdate = transportation.update({
      vehicle:updatePackageDto.vehicle,
      pickup_point:updatePackageDto.pickup_point,
      drop_point:updatePackageDto.drop_point,
      details:updatePackageDto.details
    })
    let updated = await this._agencyPackageRepo.update(id,packageUpdate)
    console.log(updated,'in package Mapper');
    if(!updated) return null
    let updateTransportation = await this._transportationRepo.update(transportation.id,transportationUpdate)
    console.log(updateTransportation);
    if(!updateTransportation) return null
    return PackageMapper.toPackageDto(updated,updateTransportation)
  }

  async trendingPackages(){
    let fetchTrendingPackages = await this._agencyPackageRepo.trendinPackages()
    console.log(fetchTrendingPackages,'fetchTrendingPackagessss');
    return PackageMapper.toTrendingPackageDto(fetchTrendingPackages)
  }
}
