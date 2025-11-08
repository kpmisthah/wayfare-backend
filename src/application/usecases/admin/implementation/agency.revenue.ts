import { IAgencyRevenueRepository } from "src/domain/repositories/admin/agency-revenue.repository.interface";
import { IAgencyRevenue } from "../interfaces/agency-revenue.usecase.interface";
import { Inject } from "@nestjs/common";

export class AgencyRevenue implements IAgencyRevenue{
    constructor(
        @Inject('IAgenciesRevenueRepository')
        private readonly _agencyRevenueRepo:IAgencyRevenueRepository
    ){}

    async getAgencyRevenueSummary(){
        return await this._agencyRevenueRepo.getAgencyRevenueSummary()
    }
}