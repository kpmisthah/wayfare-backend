
export class AgencyResponseDto {
  description: string | null;
  // status: AgencyStatus;
  // specialization: string[];
  // phone: string;
  pendingPayouts: number;
  totalEarnings: number;
  address: string;
  licenseNumber?: string;
  ownerName?: string;
  websiteUrl?: string;
}
