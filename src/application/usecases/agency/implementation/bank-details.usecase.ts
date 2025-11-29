import { Inject, Injectable } from "@nestjs/common";
import { BankDetailsDto } from "src/application/dtos/request-payout.dto";
import { BankingEntity } from "src/domain/entities/banking.entity";
import { IBankingDetailsRepository } from "src/domain/interfaces/agency-bookibnng-details.interface";
import { BankingMapper } from "../../mapper/banking-detail.mapper";
import { IBankingDetailsUsecase } from "../interfaces/agnecy-banking-details.usecase.interface";

@Injectable()
export class BankingDetailsUsecase implements IBankingDetailsUsecase{
    constructor(
        @Inject('IBankingDetailsRepository')
        private readonly _bankingDetailsRepo:IBankingDetailsRepository
    ){}
    async bankDetails(bankDetailsDto:BankDetailsDto):Promise<BankDetailsDto|null>{
        let bankDetails = BankingEntity.create({
            agencyId:bankDetailsDto.agencyId,
            accountHolderName:bankDetailsDto.accountHolderName,
            accountNumber:bankDetailsDto.accountNumber,
            ifcCode:bankDetailsDto.ifscCode,
            bankName:bankDetailsDto.bankName,
            branch:bankDetailsDto.branch
        })
        console.log(bankDetails,'bank detailsss')
        let createBankDetails = await this._bankingDetailsRepo.create(bankDetails)
        console.log(createBankDetails,'createBankDetails')
        if(!createBankDetails) return null
        return BankingMapper.toBankingDetailsDto(createBankDetails)
    }
}