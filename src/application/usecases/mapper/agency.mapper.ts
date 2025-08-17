import { AgencyProfileDto } from "src/application/dtos/agency-profile.dto";
import { AgencyResponseDto } from "src/application/dtos/agency-response.dto";
import { AgencyEntity } from "src/domain/entities/agency.entity";
import { UserEntity } from "src/domain/entities/user.entity";


export class AgencyMapper {
    static toAgencyDto(agencyEntity:AgencyEntity):AgencyResponseDto{
        return {
            description:agencyEntity.description,
            status:agencyEntity.status,
            specialization:agencyEntity.specialization,
            phone:agencyEntity.phone,
            pendingPayouts:agencyEntity.pendingPayouts,
            totalEarnings:agencyEntity.totalEarnings,
            
        }
    }
    static toAgencyProfileDto(agencyEntity:AgencyEntity,userEntity:UserEntity):AgencyProfileDto{
        return{
            id:agencyEntity.id,
            description:agencyEntity.description,
            status:agencyEntity.status,
            phone:agencyEntity.phone,
            user:{
                name:userEntity.name,
                email:userEntity.email
            }
        }
    }
}