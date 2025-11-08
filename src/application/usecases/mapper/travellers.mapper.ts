import { TravellersDto } from "src/application/dtos/travellers.dto";
import { AiTripEntity } from "src/domain/entities/ai.trip.entity";
import { UserProfileEntity } from "src/domain/entities/user-profile.entity";
import { UserEntity } from "src/domain/entities/user.entity";

export class TravellersMapper {

    static toTravellerDto(trip:AiTripEntity,user?:UserEntity,userProfile?:UserProfileEntity|null):TravellersDto{

        return {
            id:trip.id,
            destination:trip.destination,
            startDate:trip.startDate,
            name:user?.name ?? '',
            profileImage:user?.profileImage ?? '',
            location:userProfile?.location ?? ''
        }
    }
    static toTravellersDto(userEntity:(UserEntity|null)[],tripEntity:AiTripEntity[],userProfile:(UserProfileEntity|null)[]):TravellersDto[]{
        return tripEntity.map((trip)=>{
            let user = userEntity.find((u)=>u && u.id == trip.userId)
            console.log(user,'in toTravellersDto');
            if(!user) throw new Error("User not found")
            let profile = userProfile.find((userPro)=>userPro && userPro.userId == trip.userId)
            console.log(profile,'in profileTotravelersDto');
            return TravellersMapper.toTravellerDto(trip,user,profile)
        })
    }
    static toWholeTravellerDto(aiTripEntity:AiTripEntity):TravellersDto{
        return{
            id:aiTripEntity.userId,
            destination:aiTripEntity.destination,
            startDate:aiTripEntity.startDate,
            name:aiTripEntity.userName ?? '',
            profileImage:aiTripEntity.profileImage ?? '',
            location:aiTripEntity.location ?? ''
        }
    }
    static toWholeTravellersDto(aiTripEntity:AiTripEntity[]):TravellersDto[]{
        return aiTripEntity.map((trip)=>this.toWholeTravellerDto(trip))
    }
}