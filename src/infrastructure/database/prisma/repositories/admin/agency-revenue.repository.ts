import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { IAgencyRevenueRepository } from "src/domain/repositories/admin/agency-revenue.repository.interface";

@Injectable()
export class AgenciesRevenueRepository implements IAgencyRevenueRepository{
    constructor(private readonly _prisma:PrismaService){}
    async getAgencyRevenueSummary(){
        const agencySummary = await this._prisma.booking.groupBy({
            by:['agencyId'],
            _sum:{
                platformEarning:true
            },
            _count:{
                _all:true
            }
        })
    const agencyId = agencySummary.map(a=>a.agencyId)
    const agency = await this._prisma.agency.findMany({
        where:{id:{in:agencyId}},
        select:{id:true,user:{select:{name:true}}}
    })
    
    const result = agencySummary.map((summary)=>{
        const matchedAgencies = agency.find((agency)=>agency.id == summary.agencyId)
        return{
            agencyId:summary.agencyId,
            agencyName:matchedAgencies?.user.name ?? '',
            platfromEarning:summary._sum.platformEarning,
            all:summary._count._all
        }
    })
    
    return result
    }
    

}