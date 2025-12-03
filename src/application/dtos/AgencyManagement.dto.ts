import { AgencyEntity } from 'src/domain/entities/agency.entity';

export class AgencyManageDto {
  domain: AgencyEntity;
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
