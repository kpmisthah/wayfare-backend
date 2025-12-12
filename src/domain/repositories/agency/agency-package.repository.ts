import { PackageEntity } from 'src/domain/entities/package.entity';
import { IBaseRepository } from '../base.repository';

export interface IAgencyPackageRepository
  extends IBaseRepository<PackageEntity | null> {
  addPackages(packages: PackageEntity): Promise<PackageEntity>;
  getPackages(id: string): Promise<PackageEntity[]>;
  findByAgencyId(agencyId: string | undefined): Promise<PackageEntity[]>;
  findActiveByAgencyId(agencyId: string | undefined): Promise<PackageEntity[]>;
  findBookedPackage(agencyId: string): Promise<PackageEntity | null>;
  filterPackages(
    destination: string,
    duration: number,
    minBudget: number,
    maxBudget: number,
  ): Promise<PackageEntity[]>;
  getAllPackages(): Promise<PackageEntity[]>;
  countPackages(agencyId: string, search?: string): Promise<number>;
  getPackagesByPage(
    agencyId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<PackageEntity[]>;
  trendinPackages(): Promise<PackageEntity[]>;
}
