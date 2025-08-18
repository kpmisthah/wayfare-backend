import { AgencyStatus } from 'src/domain/enums/agency-status.enum';

export class AgencyResponseDto {
 
    description: string|null;
    status: AgencyStatus;
    specialization: string[];
    phone: string;
    pendingPayouts: number;
    totalEarnings: number;
}