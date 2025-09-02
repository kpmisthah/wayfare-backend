import { $Enums, Agency, Package, Prisma } from "@prisma/client";
import { AgencyEntity } from "src/domain/entities/agency.entity";
import { AgencyStatus } from "src/domain/enums/agency-status.enum";


// type Profile = {
//     id:string,
//     description:string|null,
//     // phone:string,
//     status:$Enums.AgencyStatus
//     address:string|null
//     licenseNumber:string|null
//     ownerName:string|null
//     websiteUrl:string|null
//     user:{
//         name:string,
//         email:string,
//         isVerified:boolean
//     }
// }
export class AgencyMapper {
    static toDomain(agency:Agency):AgencyEntity{
        return new AgencyEntity(
            agency.id,
            agency.description,
            agency.status as AgencyStatus,
            // agency.specialization,
            // agency.phone,
            // agency.role as Role,
            agency.userId,
            agency.pendingPayouts,
            agency.totalEarnings, 
            agency.address,
            agency.licenseNumber ?? '',
            agency.ownerName ?? '',
            agency.websiteUrl ?? '',        
            agency.transactionId ?? '',
            
        )
    }

    static toDomainMany(agencies:Agency[]):AgencyEntity[]{
      return agencies.map((agency)=>{
        return AgencyMapper.toDomain(agency)
      })
    }
    static toPrisma(agency:AgencyEntity):Prisma.AgencyCreateInput {
        return{
            description:agency.description,
            status:agency.status,
            // specialization:agency.specialization,
            // phone:agency.phone,
            // role:agency.role,            
            pendingPayouts:agency.pendingPayouts,
            totalEarnings:agency.totalEarnings,
            address:agency.address,
            licenseNumber:agency.licenseNumber,
            ownerName:agency.ownerName,
            websiteUrl:agency.websiteUrl,
            user:{
             connect:{id:agency.userId}
            }
        }
    }
  static toProfile(agencies: Agency[]): AgencyEntity[] {
    return agencies.map((agency) => {
      return AgencyMapper.toDomain(agency)
    })
  }
}