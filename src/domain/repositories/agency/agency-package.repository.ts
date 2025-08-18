import { Package } from "@prisma/client";

export interface IAgencyPackageRepository{
    addPackages(addPackageDto:{title:string,destination:string,duration:string,max:string,description:string,highlights:string,price:string},agencyId:string,uploadedUrls:string[]):Promise<Package>
    getPackages():Promise<Pick<Package,'itineraryName'|'destination'|'duration'|'status'|'createdAt'>[]>    
}