import { AuthUserDto } from '../../dtos/auth-user.dto';
import { SafeUser } from '../../dtos/safe-user.dto';
import { UpdateStatusDto } from '../../dtos/update-status.dto';
import { UpdateUserProfileDto } from '../../dtos/update-user-profile.dto';
import { UserProfileDto } from '../../dtos/user-profile.dto';
import { UserWithPasswordDto } from '../../dtos/user-with-password.dto';
import { UserProfileEntity } from '../../../domain/entities/user-profile.entity';
import { UserEntity } from '../../../domain/entities/user.entity';

export class UserMapper {

  static toAuthUserDto(userEntity: UserEntity): AuthUserDto {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      role: userEntity.role,
      isVerified: userEntity.isVerified,
      isBlock: userEntity.isBlock,
      phone: userEntity.phone,
      profileImage: userEntity.profileImage,
      bannerImage: userEntity.bannerImage,
    };
  }

  static toUserWithPasswordDto(userEntity: UserEntity): UserWithPasswordDto {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      role: userEntity.role,
      isVerified: userEntity.isVerified,
      isBlock: userEntity.isBlock,
      phone: userEntity.phone,
      profileImage: userEntity.profileImage,
      bannerImage: userEntity.bannerImage,
      refreshToken: userEntity.refreshToken,
    };
  }

  static toSafeUserDto(userEntity: UserEntity): SafeUser {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      isBlock: userEntity.isBlock,
      role: userEntity.role,
      isVerified: userEntity.isVerified,
      phone: userEntity.phone,
      refreshToken: userEntity.refreshToken,
      profileImage: userEntity.profileImage,
    };
  }

  static toUserProfileDto(
    userProfileEntity: UserProfileEntity,
    userEntity: UserEntity,
  ): UserProfileDto {
    return {
      id: userProfileEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      profileImage: userEntity.profileImage,
      bannerImage: userEntity.bannerImage,
      location: userProfileEntity.location,
      phone: userProfileEntity.phone,
    };
  }
  static toUserProfileUpdateDto(
    userProfileEntity: UserProfileEntity,
    userEntity: UserEntity,
  ): UpdateUserProfileDto {
    return {
      name: userEntity.name,
      email: userEntity.email,
      phone: userProfileEntity.phone,
      location: userProfileEntity.location,
    };
  }
  static toUpdateStatus(userEntity: UserEntity): UpdateStatusDto {
    return {
      isBlock: userEntity.isBlock,
    };
  }
}
