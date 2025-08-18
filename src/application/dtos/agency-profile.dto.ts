import { AgencyStatus } from 'src/domain/enums/agency-status.enum';

export class AgencyProfileDto {
  id: string;
  description: string | null;
  status: AgencyStatus;
  phone: string;
  user: {
    name: string;
    email: string;
  };
}