
export class AgencyProfileDto {
  id: string;
  description: string | null;
  // isBlock: boolean;
  // phone: string;
  address: string | null;
  licenseNumber?: string;
  ownerName?: string;
  websiteUrl?: string;
  user: {
    name: string;
    email: string;
    verified: boolean;
    profileImage:string
  };
}
