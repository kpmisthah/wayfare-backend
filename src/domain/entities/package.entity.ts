import { PackageStatus } from "../enums/package-status.enum";

export class PackageEntity {
    constructor(
        id:string,
        agencyId:string,
        itineraryName:string,
        description:string,
        highlights:string,
        picture:string[],
        duration:string,
        startDates:string,
        destination:string,
        status:PackageStatus,
        price:string,
        
    ){}
}