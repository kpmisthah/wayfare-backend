import { BankDetailsDto } from "src/application/dtos/request-payout.dto";

export interface IBankingDetailsUsecase{
    bankDetails(bankDetailsDto:BankDetailsDto):Promise<BankDetailsDto|null>
}