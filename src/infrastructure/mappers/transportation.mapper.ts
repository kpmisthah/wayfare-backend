import { Prisma, Transportation } from "@prisma/client";
import { TransportationEntity } from "src/domain/entities/transportation.entity";


export class TransportationMapper{
    static toDomain(transportation:Transportation):TransportationEntity{
        return new TransportationEntity(
            transportation.id,
            transportation.vehicle,
            transportation.pickup_point,
            transportation.drop_point,
            transportation.details
        ) 
    }

    static toPrisma(transportaionEntity:TransportationEntity):Prisma.TransportationCreateInput {
        return {
            vehicle:transportaionEntity.vehicle,
            pickup_point:transportaionEntity.pickup_point,
            drop_point:transportaionEntity.drop_point,
            details:transportaionEntity.details
        }
    }
}