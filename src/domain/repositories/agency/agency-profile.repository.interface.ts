import { AgencyEntity } from "src/domain/entities/agency.entity";

export interface IAgencyProfileRepository {
    updateProfile(updateAgencyProfile:AgencyEntity,agencyId):Promise<AgencyEntity|null>
    getAgencyProfile(): Promise<AgencyEntity[]|null>
    findByUserId(id:string):Promise<AgencyEntity|null> 
}