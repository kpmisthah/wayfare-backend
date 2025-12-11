export class AgencyProfileDto {
  id: string;
  description: string | null;
  // isBlock: boolean;
  phone: string;
  email: string;
  address: string | null;
  licenseNumber?: string;
  ownerName?: string;
  websiteUrl?: string;
  user: {
    name: string;
    email: string;
    verified: boolean;
    profileImage: string;
    bannerImage: string;
  };
}
