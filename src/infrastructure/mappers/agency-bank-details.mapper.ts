import { AgencyBankDetails, Prisma } from '@prisma/client';
import { BankingEntity } from '../../domain/entities/banking.entity';

export class AgencyBankDetailsMapper {
  static toDomain(agencyBankDetails: AgencyBankDetails): BankingEntity {
    const obj = new BankingEntity(
      agencyBankDetails.id,
      agencyBankDetails.agencyId,
      agencyBankDetails.accountHolderName,
      agencyBankDetails.accountNumber,
      agencyBankDetails.ifscCode,
      agencyBankDetails.bankName ?? '',
      agencyBankDetails.branch ?? '',
    );
    return obj;
  }
  static toPrisma(
    agencyBankDetails: BankingEntity,
  ): Prisma.AgencyBankDetailsCreateInput {
    const obj = {
      accountHolderName: agencyBankDetails.accountHolderName,
      accountNumber: agencyBankDetails.accountNumber,
      ifscCode: agencyBankDetails.ifcCode,
      bankName: agencyBankDetails.bankName,
      agency: { connect: { id: agencyBankDetails.agencyId } },
      branch: agencyBankDetails.branch,
    };
    return obj;
  }
}
