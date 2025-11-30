import { AgencyBankDetails, Prisma } from "@prisma/client";
import { BankingEntity } from "src/domain/entities/banking.entity";

export class AgencyBankDetailsMapper{
    static toDomain(agencyBankDetails:AgencyBankDetails):BankingEntity{
        let obj = new BankingEntity(
            agencyBankDetails.id,
            agencyBankDetails.agencyId,
            agencyBankDetails.accountHolderName,
            agencyBankDetails.accountNumber,
            agencyBankDetails.ifscCode,
            agencyBankDetails.bankName ?? '',
            agencyBankDetails.branch ?? ''
        )
        console.log(obj,'obj in toDmain');
        return obj
    }
    static toPrisma(agencyBankDetails:BankingEntity):Prisma.AgencyBankDetailsCreateInput{
        let obj = {
            accountHolderName:agencyBankDetails.accountHolderName,
            accountNumber:agencyBankDetails.accountNumber,
            ifscCode:agencyBankDetails.ifcCode,
            bankName:agencyBankDetails.bankName,
            agency:{connect:{id:agencyBankDetails.agencyId}},
            branch:agencyBankDetails.branch
            
        }
        console.log(obj,'in proussa')
        return obj
    }
}