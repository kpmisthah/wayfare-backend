import { BankDetailsDto } from '../../../dtos/request-payout.dto';

export interface IBankingDetailsUsecase {
  bankDetails(
    bankDetailsDto: BankDetailsDto,
    userId: string,
  ): Promise<BankDetailsDto | null>;
  getBankDetailsByAgency(userId: string): Promise<BankDetailsDto | null>;
  updateBankDetails(
    userId: string,
    updateBankDetailsDto: Partial<BankDetailsDto>,
  ): Promise<BankDetailsDto | null>;
}
