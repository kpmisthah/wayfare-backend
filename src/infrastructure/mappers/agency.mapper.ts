import { $Enums, Agency, Package, Prisma } from "@prisma/client";
import { AgencyProfileDto } from "src/application/dtos/agency-profile.dto";
import { AgencyEntity } from "src/domain/entities/agency.entity";
import { AgencyStatus } from "src/domain/enums/agency-status.enum";
import { Role } from "src/domain/enums/role.enum";

type Profile = {
    id:string,
    description:string|null,
    phone:string,
    status:$Enums.AgencyStatus
    user:{
        name:string,
        email:string
    }
}
export class AgencyMapper {
    static toDomain(agency:Agency):AgencyEntity{
        return new AgencyEntity(
            agency.id,
            agency.description,
            agency.status as AgencyStatus,
            agency.specialization,
            agency.phone,
            agency.role as Role,
            agency.userId,
            agency.pendingPayouts,
            agency.totalEarnings,         
            agency.transactionId,
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
            specialization:agency.specialization,
            phone:agency.phone,
            role:agency.role,            
            pendingPayouts:agency.pendingPayouts,
            totalEarnings:agency.totalEarnings,
            user:{
             connect:{id:agency.userId}
            }
        }
    }
  static toProfile(agencies: Profile[]): AgencyProfileDto[] {
    return agencies.map((agency) => ({
      id: agency.id,
      description:agency.description,
      status: agency.status as AgencyStatus,
      phone:agency.phone,
      user: {
        name: agency.user.name,
        email: agency.user.email,
      },
    }));
  }
}