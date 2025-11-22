import { IsString } from 'class-validator';

export class AgencyManagementDto {
  @IsString()
  id?: string;
  // status: AgencyStatus;
  address: string | null;
  licenseNumber: string;
  ownerName: string;
  websiteUrl: string;
  description: string;
  user: {
    name: string;
    email: string;
    isVerified: boolean;
    image: string;
    isBlock: boolean;
  };
}
