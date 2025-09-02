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
import { AgencyMapper } from '../../mapper/agency.mapper';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { PackageStatus } from 'src/domain/enums/package-status.enum';
import { TransportationEntity } from 'src/domain/entities/transportation.entity';
import { ITransportationRepository } from 'src/domain/repositories/agency/transportation.repository';

@Injectable()
export class AgencyPackageService implements IAgencyPackageService{
   
    constructor(
        @Inject(AGENCY_PACKAGE_TYPE.IAgencyPackageRepository)
        private readonly agencyPackageRepo:IAgencyPackageRepository,
        @Inject('ICloudinaryService')
        private readonly cloudinaryService:ICloudinaryService,
        @Inject('IAgencyRepository')
        private readonly agencyRepo: IAgencyRepository,
        @Inject("IIteneraryRepository")
        private readonly iteneraryRepo:IItineraryRepository,
        @Inject("IUserService")
        private readonly userRepo:IUserRepository,
        @Inject('ITransportationRepository')
        private readonly _transportationRepo:ITransportationRepository

    ){}
    async addPackages(addPackageDto:PackageDto,userId:string,files:Express.Multer.File[]):Promise<PackageDto|null>{
        console.log(addPackageDto,'addPackageDto');
        console.log(userId,'userId');
        const uploadedUrls: string[] = [];
        for (const file of files) {
            const imageUrl = await this.cloudinaryService.uploadImage(file); 
            uploadedUrls.push(imageUrl);
        }
        let existingAgency = await this.agencyRepo.findByUserId(userId)
        console.log(existingAgency,'exisitng agency');
        
        if(!existingAgency){
            return null
        }           
        let createTransport = TransportationEntity.create({
            vehicle:addPackageDto.vehicle,
            pickup_point:addPackageDto.pickup_point,
            drop_point:addPackageDto.drop_point,
            details:addPackageDto.details,
        })

        let transportaionEntity = await this._transportationRepo.create(createTransport)
        if(!transportaionEntity){
            return null
        }        
           
        let createPackage = PackageEntity.create({
            agencyId:existingAgency.id,
            itineraryName:addPackageDto.title,
            description:addPackageDto.description,
            highlights:addPackageDto.highlights,
            picture:uploadedUrls,
            duration:addPackageDto.duration,
            destination:addPackageDto.destination,
            status:PackageStatus.INACTIVE,
            price:addPackageDto.price,
            transportationId:transportaionEntity.id
        })        
        let savePackage = await this.agencyPackageRepo.addPackages(createPackage)
        console.log(savePackage,'savePacakge');
        
        if(!savePackage){
            return null
        }  
        const itinerary = addPackageDto.itinerary.map((it)=>{
            return ItineraryEntity.create({
            day:it.day,
            activities:it.activities,
            meals:it.meals,
            accommodation:it.accommodation,
            packageId:savePackage.id
        })
        })
   
        console.log(itinerary,'create itenerary.create for agency package service');
        
        let saveItinerary = await Promise.all(itinerary.map((it)=>this.iteneraryRepo.create(it)))
        if(!saveItinerary){
            return null
        }
        console.log(saveItinerary,'saveeeItinnerrraaryy');


        
        return AgencyMapper.toPackageDto(savePackage,saveItinerary,transportaionEntity)
    }

    async getPackages():Promise<PackageDto[]|null>{
        let packages = await this.agencyPackageRepo.getPackages()
        let iteneraries = await this.iteneraryRepo.getIteneraries()
        if(!iteneraries)return null
        return AgencyMapper.toListPackages(packages,iteneraries)
        
    }

    async getAgencyPackages(userId:string):Promise<PackageDto[]|null>{
        let getAgencies = await this.agencyRepo.findByUserId(userId)
        console.log(getAgencies,'get Agencies');
        let packages = await this.agencyPackageRepo.findByAgencyId(getAgencies?.id)
        console.log(packages,'packages');
        
        const specificPackage = packages.find((pkg)=>pkg.id == getAgencies?.id)
        console.log(specificPackage,'specific package');
        
        if(!specificPackage) return null
        let itineraries = await this.iteneraryRepo.findByItenerary(specificPackage?.id)
        console.log(itineraries,'ititneraries');
        if(!itineraries) return null
        if(!packages) return null
        return AgencyMapper.toListPackages(packages,itineraries)
    }
}
