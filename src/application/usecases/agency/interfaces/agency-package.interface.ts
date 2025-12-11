import { PackageDto } from 'src/application/dtos/add-package.dto';
import { FilterPackageDto } from 'src/application/dtos/filter-package.dto';
import { TrendingDestinationDto } from 'src/application/dtos/trending-destination.dto';
import { UpdatePackageDto } from 'src/application/dtos/update-package.dto';
import { PackageStatus } from 'src/domain/enums/package-status.enum';

export interface IAgencyPackageService {
  addPackages(
    addPackageDto: PackageDto,
    userId: string,
    files: Express.Multer.File[],
  ): Promise<PackageDto | null>;
  getPackages(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    items: PackageDto[];
    page: number;
    totalPages: number;
    total: number;
  } | null>;
  getPackageDetails(packageId: string): Promise<PackageDto | null>;
  getPackagesByAgencyId(
    agencyId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: PackageDto[]; total: number; totalPages: number }>;
  filterPackages(filterPackages: FilterPackageDto): Promise<{
    data: PackageDto[];
    total: number;
    page: number;
    totalPages: number;
  } | null>;
  getAgencyPackages(userId: string): Promise<PackageDto[] | null>;
  updatePackage(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<UpdatePackageDto | null>;
  trendingPackages(): Promise<TrendingDestinationDto[]>;
  updatePackageStatus(
    id: string,
    status: PackageStatus,
  ): Promise<UpdatePackageDto | null>;
}
