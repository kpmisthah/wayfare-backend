import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateProfileDto } from '../../../dtos/create-profile.dto';
import { UserProfileDto } from '../../../dtos/user-profile.dto';
import { IProfileRepository } from '../../../../domain/repositories/user/profile.repository.interface';
import { IProfileService } from '../interfaces/profile.usecase.interface';
import { UserProfileEntity } from '../../../../domain/entities/user-profile.entity';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { PROFILE_TYPE } from '../../../../domain/types';
import { UserMapper } from '../../mapper/user.mapper';
import { GetProfileDto } from '../../../dtos/get-profile.dto';
import { UpdateUserProfileDto } from '../../../dtos/update-user-profile.dto';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    @Inject(PROFILE_TYPE.IProfileRepository)
    private readonly _profileRepo: IProfileRepository,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
  ) {}

  async getProfileData(id: string): Promise<GetProfileDto | null> {
    const userEntity = await this._userRepo.findById(id);
    if (!userEntity) {
      return null;
    }
    const getProfile = await this._profileRepo.getUserData(id);
    if (!getProfile) return null;
    return UserMapper.toUserProfileDto(getProfile, userEntity);
  }

  async createProfile(
    id: string,
    createProfileDto: CreateProfileDto,
  ): Promise<UserProfileDto | null> {
    const existingUser = await this._userRepo.findById(id);
    if (!existingUser) {
      return null;
    }

    const updateUser = existingUser.update(createProfileDto);
    await this._userRepo.update(id, updateUser);
    const userProfile = UserProfileEntity.createProfile(createProfileDto, id);
    const createUserProfileEntity =
      await this._profileRepo.createProfile(userProfile);
    if (!createUserProfileEntity) return null;
    return UserMapper.toUserProfileDto(createUserProfileEntity, existingUser);
  }

  async updateProfileImage(
    userId: string,
    imageUrl: string,
  ): Promise<Pick<User, 'profileImage' | 'bannerImage'>> {
    return this._profileRepo.updateProfileImage(userId, {
      profileImage: imageUrl,
    });
  }

  async updateProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UpdateUserProfileDto | null> {
    const user = await this._userRepo.findById(userId);
    if (!user) return null;
    const userRepoUpdate = user?.update(updateUserProfileDto);
    if (!userRepoUpdate) {
      return null;
    }
    const userRepoUpdated = await this._userRepo.update(userId, userRepoUpdate);
    const existingProfile = await this._profileRepo.findById(userId);
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

    const updateUserProfile = await this._profileRepo.updateProfile(
      userId,
      updateProfileEntity,
    );

    if (!updateUserProfile) {
      return null;
    }
    return UserMapper.toUserProfileUpdateDto(updateUserProfile, user);
  }

  async findById(userId: string): Promise<UpdateUserProfileDto | null> {
    const user = await this._userRepo.findById(userId);

    if (!user) return null;
    const userProfile = await this._profileRepo.findById(userId);

    if (!userProfile) return null;
    return UserMapper.toUserProfileDto(userProfile, user);
  }
}
