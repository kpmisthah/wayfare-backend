import { UserEntity } from '../../entities/user.entity';

// Interface for the raw booking data returned from the repository
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
