import { Package } from "@prisma/client";
import { AddPackageDto } from "src/application/dtos/add-package.dto";
import { RequestWithUser } from "../../auth/interfaces/request-with-user";

export interface IAgencyPackageService{
    addPackages(addPackageDto:AddPackageDto,agencyId:string,files:Express.Multer.File[]):Promise<Package>
    getPackages():Promise<Pick<Package,'itineraryName'|'destination'|'duration'|'status'|'createdAt'>[]>
}