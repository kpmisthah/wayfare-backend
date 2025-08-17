import { Inject, Injectable } from '@nestjs/common';
import { Package } from '@prisma/client';
import { AddPackageDto } from 'src/application/dtos/add-package.dto';
import { IAgencyPackageService } from 'src/application/usecases/agency/interfaces/agency-package.interface';
import { IAgencyPackageRepository } from 'src/domain/repositories/agency/agency-package.repository';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { ICloudinaryService } from 'src/domain/repositories/cloudinary/cloudinary.service.interface';
import { AGENCY_PACKAGE_TYPE } from 'src/domain/types';

@Injectable()
export class AgencyPackageService implements IAgencyPackageService{
   
    constructor(
        @Inject(AGENCY_PACKAGE_TYPE.IAgencyPackageRepository)
        private readonly agencyPackageRepo:IAgencyPackageRepository,
        @Inject('ICloudinaryService')
        private readonly cloudinaryService:ICloudinaryService
    ){}
    async addPackages(addPackageDto:AddPackageDto,agencyId:string,files:Express.Multer.File[]):Promise<Package>{
        const uploadedUrls: string[] = [];
        for (const file of files) {
            const imageUrl = await this.cloudinaryService.uploadImage(file); 
            uploadedUrls.push(imageUrl);
        }
        console.log(addPackageDto,'addPckgDto',agencyId,'agencyId');
        
        return await this.agencyPackageRepo.addPackages(addPackageDto,agencyId,uploadedUrls)
    }

    async getPackages():Promise<Pick<Package,'itineraryName'|'destination'|'duration'|'status'|'createdAt'>[]>{
        return await this.agencyPackageRepo.getPackages()
    }
}
