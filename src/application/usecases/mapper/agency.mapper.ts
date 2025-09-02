import { PackageDto } from "src/application/dtos/add-package.dto";
import { AgencyManagementDto } from "src/application/dtos/agency-management.dto";
import { AgencyProfileDto } from "src/application/dtos/agency-profile.dto";
import { AgencyResponseDto } from "src/application/dtos/agency-response.dto";
import { AgencyEntity } from "src/domain/entities/agency.entity";
import { ItineraryEntity } from "src/domain/entities/itinerary.entity";
import { PackageEntity } from "src/domain/entities/package.entity";
import { TransportationEntity } from "src/domain/entities/transportation.entity";
import { UserEntity } from "src/domain/entities/user.entity";


export class AgencyMapper {
    static toAgencyDto(agencyEntity:AgencyEntity):AgencyResponseDto{
        return {
            description:agencyEntity.description,
            status:agencyEntity.status,
            // specialization:agencyEntity.specialization,
            // phone:agencyEntity.phone,
            pendingPayouts:agencyEntity.pendingPayouts,
            totalEarnings:agencyEntity.totalEarnings,
            licenseNumber:agencyEntity.licenseNumber,
            ownerName:agencyEntity.ownerName,
            address:agencyEntity.address ?? '',
            websiteUrl:agencyEntity.websiteUrl
            
        }
    }
    static toAgencyProfileDto(agencyEntity:AgencyEntity,userEntity:UserEntity):AgencyProfileDto{
        return{
            id:agencyEntity.id,
            description:agencyEntity.description,
            status:agencyEntity.status,
            // phone:agencyEntity.phone,
            address:agencyEntity.address,
            licenseNumber:agencyEntity.licenseNumber,
            ownerName:agencyEntity.ownerName,
            websiteUrl:agencyEntity.websiteUrl,
            user:{
                name:userEntity.name,
                email:userEntity.email,
                verified:userEntity.isVerified   
             }
        }
    }
    static toAgencyManagement(agencyEntity:AgencyEntity,userEntity:UserEntity){
        return{
            id:agencyEntity.id,
            status:agencyEntity.status,
            address:agencyEntity.address ?? '',
            licenseNumber:agencyEntity.licenseNumber ?? '',
            ownerName:agencyEntity.ownerName ?? '',
            websiteUrl:agencyEntity.websiteUrl??'',
            description:agencyEntity.description ?? '',
            user:{
                name:userEntity.name,
                email:userEntity.email,
                verified:userEntity.isVerified,
                image:userEntity.profileImage
            }
        }
    }
    static toListAgencies(agencyEntity:AgencyEntity[],userEntity:UserEntity[]){
        console.log(agencyEntity,'agencyEntity');
        console.log(userEntity,'userEntity');
        
        return agencyEntity.map((agency)=>{
            let userForAgency = userEntity.find((user)=>user.id == agency.userId)
            console.log(userForAgency,'user for agebnct');
            
            if (!userForAgency) {
                throw new Error(`No user found for agency ${agency.id}`)}
            return AgencyMapper.toAgencyManagement(agency,userForAgency)
        })
    }
    static toPackageDto(packageEntity:PackageEntity,itineraryEntity:(ItineraryEntity|null)[],transportationEntity?:TransportationEntity):PackageDto{
        const validation = itineraryEntity.filter((it)=>it!=null)
        return {
            id:packageEntity.id,
            title:packageEntity.itineraryName,
            destination:packageEntity.destination,
            description:packageEntity.description,
            highlights:packageEntity.highlights,
            duration:packageEntity.duration,
            picture:packageEntity.picture,
            price:packageEntity.price,
            itinerary:validation.map((it)=>({
                day:it.day,
                activities:it.activities,
                meals:it.meals,
                accommodation:it.accommodation
            })),
            status:packageEntity.status,
            vehicle:transportationEntity?.vehicle ?? '',
            pickup_point:transportationEntity?.pickup_point ?? '',
            drop_point:transportationEntity?.drop_point ?? '',
            details:transportationEntity?.details??''
            
        }
    }
    static toListPackages(packageEntity:PackageEntity[],itineraryEntity:ItineraryEntity[]):PackageDto[]{
        return packageEntity.map((pkg)=>{
            let itnForPackage = itineraryEntity.filter(it=>it.packageId == pkg.id)
            return AgencyMapper.toPackageDto(pkg,itnForPackage)
        })
    }
}