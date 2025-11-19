import { PackageDto } from 'src/application/dtos/add-package.dto';
import { FilterPackageDto } from 'src/application/dtos/filter-package.dto';
import { UpdatePackageDto } from 'src/application/dtos/update-package.dto';

export interface IAgencyPackageService {
  addPackages(
    addPackageDto: PackageDto,
    userId: string,
    files: Express.Multer.File[],
  ): Promise<PackageDto | null>;
  getPackages(userId: string,page:number,limit:number): Promise<{items:PackageDto[],page:number,totalPages:number,total:number}|null>
  getPackageDetails(packageId: string): Promise<any | null>;
  getPackagesByAgencyId(agencyId: string,page:number,limit:number): Promise<{data:PackageDto[],total:number,totalPages:number}>
  filterPackages(filterPackages:FilterPackageDto)
  getAgencyPackages(userId: string): Promise<PackageDto[] | null> 
  updatePackage(id,updatePackageDto:UpdatePackageDto):Promise<UpdatePackageDto|null>
  trendingPackages()
}
