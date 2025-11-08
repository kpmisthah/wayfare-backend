import { ResponsePackageDto } from "src/application/dtos/response-package.dto";
import { UpdatePackageDto } from "src/application/dtos/update-package.dto";
import { PackageEntity } from "src/domain/entities/package.entity";

export class PackageMapper {
    static toPackageDto(travelPacakge:PackageEntity):ResponsePackageDto{
        return {
            id:travelPacakge.id,
            title:travelPacakge.itineraryName,
            destination:travelPacakge.destination,
            duration:travelPacakge.duration,
            status:travelPacakge.status
        }
    }
}