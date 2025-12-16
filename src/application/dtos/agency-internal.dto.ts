export interface AgencyInternalDto {
  id: string;
  userId: string;
  description?: string | null;
  address?: string;
  licenseNumber?: string;
  ownerName?: string;
  websiteUrl?: string;
  pendingPayouts: number;
  totalEarnings: number;
  reason?: string;
}
