import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { ItineraryEntity } from "src/domain/entities/itinerary.entity";
import { PrismaService } from "../../prisma.service";
import { PackageMapper } from "src/infrastructure/mappers/package.mapper";
import { IItineraryRepository } from "src/domain/repositories/agency/itenerary.repository";
import { IteneraryMapper } from "src/infrastructure/mappers/itenerary.mapper";

@Injectable()
export class ItineraryRepository extends BaseRepository<ItineraryEntity> implements IItineraryRepository {
    constructor(private readonly _prisma:PrismaService){
        super(_prisma.itenerary,PackageMapper)
    }
    async getIteneraries():Promise<ItineraryEntity[]|null>{
        let itineraries = await this._prisma.itenerary.findMany()
        if(!itineraries.length)return null
        return IteneraryMapper.toDomains(itineraries)
    }
}