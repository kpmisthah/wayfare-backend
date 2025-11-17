import { ResponsePackageDto } from "src/application/dtos/response-package.dto";
import { UpdatePackageDto } from "src/application/dtos/update-package.dto";
import { PackageEntity } from "src/domain/entities/package.entity";
import { TransportationEntity } from "src/domain/entities/transportation.entity";

export class PackageMapper {
    static toPackageDto(travelPacakge:PackageEntity,transportation:TransportationEntity):ResponsePackageDto{
        return {
            id:travelPacakge.id,
            title:travelPacakge.itineraryName,
            destination:travelPacakge.destination,
            description:travelPacakge.description,
            highlights:travelPacakge.highlights,
            duration:travelPacakge.duration,
            picture:travelPacakge.picture,
            price:travelPacakge.price,
            vehicle:transportation.vehicle,
            pickup_point:transportation.pickup_point,
            drop_point:transportation.drop_point,
            details:transportation.details,
            status:travelPacakge.status
        }
    }
}