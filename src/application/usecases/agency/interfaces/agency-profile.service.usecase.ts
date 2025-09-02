import { AgencyProfileDto } from "src/application/dtos/agency-profile.dto";
import { UpdateAgencyProfileDto } from "src/application/dtos/update-agency-profile.dto";
import { AgencyProfile } from "src/domain/interfaces/agency-profile.interface";

export interface IAgencyProfileService {
    updateProfile(agencyId,updateAgencyProfileDto:UpdateAgencyProfileDto):Promise<AgencyProfileDto|null>
    getAgencyProfile()
    findProfile(id:string)   
}