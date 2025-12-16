
import { AgencyRevenueDTO } from '../dtos/agency-revenue.dto';
import { PayoutDetailsDTO } from '../dtos/payout-details.dto';
import { WalletTransactionDto } from '../dtos/wallet-transaction.dto';


export interface AgencyRevenueSummaryResult {
  data: AgencyRevenueDTO[];
  total: number;
  page: number;
  totalPages: number;
}


export interface PayoutDetailsResult {
  data: PayoutDetailsDTO[];
  total: number;
}

export interface TransactionSummaryResult {
  data: WalletTransactionDto[];
  total: number;
  page: number;
  totalPages: number;
}


export interface UserGroupResult {
  id: string;
  name: string;
  avatar: string | null;
  creatorId: string;
  createdAt: Date;
  type: string;
  members: {
    user: {
      id: string;
      name: string;
      profileImage: string | null;
    };
    role: string;
  }[];
}

export interface AgencyWithUserResult {
  domain: {
    id: string;
    userId: string;
    description?: string | null;
    address?: string | null;
    licenseNumber?: string;
    ownerName?: string;
    websiteUrl?: string;
    pendingPayouts: number;
    totalEarnings: number;
    reason?: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    profileImage: string;
    isBlock: boolean;
  };
  packageCount: number;
}
