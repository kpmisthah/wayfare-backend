import { Inject, Injectable } from "@nestjs/common";

import { IAdminRevenue } from "../interfaces/admin-revenue.usecase.interface";
import { IAdminRevenueRepository } from "src/domain/repositories/admin/admin-revenue.repository.interface";
import { WalletTransactionDto } from "src/application/dtos/wallet-transaction.dto";
import { WalletTransactionMapper } from "../../mapper/wallet-transaction.mapper";

@Injectable()
export class AdminRevenue implements IAdminRevenue{
    constructor(
    @Inject('IAdminRevenueRepository')
    private readonly _adminRevenueRepo:IAdminRevenueRepository,
    ){}
    async getTotalRevenue(){
        return await this._adminRevenueRepo.getAllRevenue()
    }
    async getAllCommission(){
        return await this._adminRevenueRepo.getAllCommission()
    }

    async getWalletBalance(){
        return await this._adminRevenueRepo.getWalletBalance()
    }

    async activeAgencyCount(){
        return await this._adminRevenueRepo.activeAgenciesCount()
    }

    async getTransactionSummary():Promise<WalletTransactionDto[]>{
        let walletTransaction = await this._adminRevenueRepo.getTransactionSummary()
        return walletTransaction.map((tr)=>WalletTransactionMapper.toWalletTransactionDto(tr))
    }

}