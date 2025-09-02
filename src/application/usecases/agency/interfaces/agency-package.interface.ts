
import { PackageDto } from "src/application/dtos/add-package.dto";

export interface IAgencyPackageService{
    addPackages(addPackageDto:PackageDto,userId:string,files:Express.Multer.File[]):Promise<PackageDto|null>
    getPackages():Promise<PackageDto[]|null>
    getAgencyPackages(userId:string):Promise<PackageDto[]|null>
}