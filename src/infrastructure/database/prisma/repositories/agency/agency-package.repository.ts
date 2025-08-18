import { IAgencyPackageRepository } from "src/domain/repositories/agency/agency-package.repository";
import { PrismaService } from "../../prisma.service";
import { Package } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AgencyPackageRepository implements IAgencyPackageRepository{
    constructor(private readonly prisma:PrismaService){}
    async addPackages(addPackageDto:{title:string,destination:string,duration:string,max:string,description:string,highlights:string,price:string},agencyId:string,uploadedUrls:string[]):Promise<Package>{
        console.log(addPackageDto,'in repo')
        // let count = await this.prisma.package.count()
        // let date = new Date()
        // if(count >2 && new Date() == date){
        //     throw new Error("You cannot add more than 2 package in a day")
        // }
        return await this.prisma.package.create({
            data:{
                itineraryName:addPackageDto.title,
                description:addPackageDto.description,
                highlights:addPackageDto.highlights,
                picture:uploadedUrls,
                duration: addPackageDto.duration,
                destination:addPackageDto.destination,
                price:addPackageDto.price,
                status:"INACTIVE",
                agency:{
                    connect:{id:agencyId}
                }

            }
        })
    }

    async getPackages():Promise<Pick<Package,'itineraryName'|'destination'|'duration'|'status'|'createdAt'>[]>{
        return await this.prisma.package.findMany({
            select:{
                itineraryName:true,
                destination:true,
                duration:true,
                status:true,
                createdAt:true
            }
        })
    }
}