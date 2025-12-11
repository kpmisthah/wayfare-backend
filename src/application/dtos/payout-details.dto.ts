import { PayoutStatus } from 'src/domain/enums/payout-status.enum';

export interface PayoutDetailsDTO {
  id: string;
  amount: number;
  status: PayoutStatus;

  agencyInfo: {
    name: string;
    phone: string;
    email: string;
  };

  bankDetails: {
    bankName: string;
    accountNumber: string;
    branch: string;
    ifscCode: string;
  };
}
