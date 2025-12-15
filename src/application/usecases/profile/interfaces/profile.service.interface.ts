import { User } from '@prisma/client';
import { CreateProfileDto } from '../../../dtos/create-profile.dto';
import { GetProfileDto } from '../../../dtos/get-profile.dto';
import { UpdateUserProfileDto } from '../../../dtos/update-user-profile.dto';
import { UserProfileDto } from '../../../dtos/user-profile.dto';
export interface IProfileService {
  getProfileData(id: string): Promise<GetProfileDto | null>;
  createProfile(
    id: string,
    createProfileDto: CreateProfileDto,
  ): Promise<UserProfileDto | null>;
  updateProfileImage(
    userId,
    imageUrl: string,
  ): Promise<Pick<User, 'profileImage' | 'bannerImage'>>;
  updateProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UpdateUserProfileDto | null>;
  findById(userId: string): Promise<UpdateUserProfileDto | null>;
}
