import { DashboardStats } from 'src/domain/types/stat.type';

export interface IAdminSumaryUsecase {
  getDashboardStats(): Promise<DashboardStats>;
}
