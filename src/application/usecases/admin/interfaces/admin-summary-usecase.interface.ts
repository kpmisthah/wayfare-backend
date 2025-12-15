import { DashboardStats } from '../../../../domain/types/stat.type';

export interface IAdminSumaryUsecase {
  getDashboardStats(): Promise<DashboardStats>;
}
