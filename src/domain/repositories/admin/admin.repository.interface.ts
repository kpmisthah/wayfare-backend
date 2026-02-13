import { UserEntity } from '../../entities/user.entity';


export interface RecentBookingData {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  user?: {
    name: string;
  };
  agency?: {
    user?: {
      name: string;
    };
  };
  package?: {
    destination: string | null;
  };
}

export interface IAdminRepository {
  findAdmin(): Promise<UserEntity | null>;
  findRecentBookings(limit: number): Promise<RecentBookingData[]>;
}
