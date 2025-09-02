import { AgencyStatus } from 'src/domain/enums/agency-status.enum';

export class AgencyProfileDto {
  id: string;
  description: string | null;
  status: AgencyStatus;
  // phone: string;
  address:string|null;
  licenseNumber?:string
  ownerName?:string;
  websiteUrl?:string
  user: {
    name: string;
    email: string;
    verified:boolean
  };
}