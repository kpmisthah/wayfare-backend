import { preference } from '@prisma/client';
import { UserEntity } from 'src/domain/entities/user.entity';

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
  createPreference(preference: { name: string }): Promise<preference | null>;
  getAllPreferences(): Promise<preference[] | null>;
  findAdmin(): Promise<UserEntity | null>;
  findRecentBookings(limit: number): Promise<RecentBookingData[]>;
}
