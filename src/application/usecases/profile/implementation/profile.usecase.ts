import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateProfileDto } from 'src/application/dtos/create-profile.dto';
import { UserProfileDto } from 'src/application/dtos/user-profile.dto';
import { IProfileRepository } from 'src/domain/repositories/user/profile.repository.interface';
import { IProfileService } from 'src/application/usecases/profile/interfaces/profile.usecase.interface';
import { UserProfileEntity } from 'src/domain/entities/user-profile.entity';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { PROFILE_TYPE } from 'src/domain/types';
import { UserMapper } from 'src/application/usecases/mapper/user.mapper';
import { GetProfileDto } from 'src/application/dtos/get-profile.dto';
import { UpdateUserProfileDto } from 'src/application/dtos/update-user-profile.dto';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    @Inject(PROFILE_TYPE.IProfileRepository)
    private readonly profileRepo: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async getProfileData(id: string): Promise<GetProfileDto | null> {
    console.log('service l ethundo ', id);
    const userEntity = await this.userRepo.findById(id);
    if (!userEntity) {
      return null;
    }
    const getProfile = await this.profileRepo.getUserData(id);
    if (!getProfile) return null;
    return UserMapper.toUserProfileDto(getProfile, userEntity);
  }

  async createProfile(
    id: string,
    createProfileDto: CreateProfileDto,
  ): Promise<UserProfileDto | null> {
    const existingUser = await this.userRepo.findById(id);
    if (!existingUser) {
      return null;
    }

    const updateUser = existingUser.update(createProfileDto);
    await this.userRepo.update(id, updateUser);
    const userProfile = UserProfileEntity.createProfile(createProfileDto, id);
    const createUserProfileEntity =
      await this.profileRepo.createProfile(userProfile);
    if (!createUserProfileEntity) return null;
    return UserMapper.toUserProfileDto(createUserProfileEntity, existingUser);
  }

  async updateProfileImage(
    userId: string,
    imageUrl: string,
  ): Promise<Pick<User, 'profileImage' | 'bannerImage'>> {
    console.log(imageUrl, 'in profile service');
    return this.profileRepo.updateProfileImage(userId, {
      profileImage: imageUrl,
    });
  }

  async updateProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UpdateUserProfileDto | null> {
    const user = await this.userRepo.findById(userId);
    console.log(user, 'from updateProfile in Backend');
    if (!user) return null;
    const userRepoUpdate = user?.update(updateUserProfileDto);
    console.log(userRepoUpdate, 'userUpdate..........');
    if (!userRepoUpdate) {
      return null;
    }
    const userRepoUpdated = await this.userRepo.update(userId, userRepoUpdate);
    console.log(userRepoUpdated, 'userRepoUpdated broo');
    const existingProfile = await this.profileRepo.findById(userId);
    let updateProfileEntity: UserProfileEntity;
    if (existingProfile) {
      updateProfileEntity =
        existingProfile.updateUserProfile(updateUserProfileDto);
    } else {
      updateProfileEntity = UserProfileEntity.createProfile(
        updateUserProfileDto,
        userId,
      );
    }

    const updateUserProfile = await this.profileRepo.updateProfile(
      userId,
      updateProfileEntity,
    );
    console.log(updateUserProfile, 'updatedUserProfile');

    if (!updateUserProfile) {
      return null;
    }
    return UserMapper.toUserProfileUpdateDto(updateUserProfile, user);
  }

  async findById(userId: string): Promise<UpdateUserProfileDto | null> {
    const user = await this.userRepo.findById(userId);
    console.log(user, 'in profileRepo');

    if (!user) return null;
    const userProfile = await this.profileRepo.findById(userId);
    console.log(userProfile, 'userProfile in profile repo');

    if (!userProfile) return null;
    return UserMapper.toUserProfileDto(userProfile, user);
  }
}
