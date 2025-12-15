import { BankDetailsDto } from '../../dtos/request-payout.dto';
import { BankingEntity } from '../../../domain/entities/banking.entity';

export class BankingMapper {
  static toBankingDetailsDto(bankingEntity: BankingEntity): BankDetailsDto {
    return {
      id: bankingEntity.id,
      accountHolderName: bankingEntity.accountHolderName,
      accountNumber: bankingEntity.accountNumber,
      agencyId: bankingEntity.agencyId,
      bankName: bankingEntity.bankName,
      branch: bankingEntity.branch,
      ifscCode: bankingEntity.ifcCode,
    };
  }
}
