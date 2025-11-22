import { UserProfile } from '@prisma/client';
import { UserProfileEntity } from 'src/domain/entities/user-profile.entity';

export class UserProfileMapper {
  static toDomain(userProfile: UserProfile): UserProfileEntity {
    return new UserProfileEntity(
      userProfile.id,
      userProfile.location ?? '',
      userProfile.phone ?? '',
      userProfile.userId,
    );
  }
  static toPrisma(UserProfileEntity: UserProfileEntity) {
    return {
      // id:UserProfileEntity.id,
      location: UserProfileEntity.location,
      phone: UserProfileEntity.phone,
      user: {
        connect: { id: UserProfileEntity.userId },
      },
    };
  }

  // static toDomainMany(userProfile:UserProfile[]):UserProfileEntity[]{
  //   return userProfile.map((user)=>{
  //     return UserProfileMapper.toDomain(user)
  //   })
  // }
}
