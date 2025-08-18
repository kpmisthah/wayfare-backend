import { SafeUser } from "src/application/dtos/safe-user.dto";
import { UpdateUserProfileDto } from "src/application/dtos/update-user-profile.dto";
import { UserProfileDto } from "src/application/dtos/user-profile.dto";
import { UserProfileEntity } from "src/domain/entities/user-profile.entity";
import { UserEntity } from "src/domain/entities/user.entity";

export class UserMapper {
    static toSafeUserDto(userEntity:UserEntity):SafeUser{
        return {
            id:userEntity.id,
            name:userEntity.name,
            email:userEntity.email,
            isBlock:userEntity.isBlock,
            role:userEntity.role
        }
    }

    static toUserProfileDto(userProfileEntity:UserProfileEntity,userEntity:UserEntity):UserProfileDto{
        return{
            id:userProfileEntity.id,
            name:userEntity.name,
            email:userEntity.email,
            profileImage:userEntity.profileImage,
            bannerImage:userEntity.bannerImage,
            location:userProfileEntity.location,
            phone:userProfileEntity.phone
        }
    }
    static toUserProfileUpdateDto(userProfileEntity:UserProfileEntity,userEntity:UserEntity):UpdateUserProfileDto{
        return{
            name:userEntity.name,
            email:userEntity.email,
            phone:userProfileEntity.phone,
            location:userProfileEntity.phone
        }
    }
}