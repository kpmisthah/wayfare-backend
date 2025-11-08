import { User } from '@prisma/client';
import { UserProfileEntity } from 'src/domain/entities/user-profile.entity';

export interface IProfileRepository {
  //preferences ozhivaakkiii
  getUserData(id: string): Promise<UserProfileEntity | null>;
  updateProfileImage(
    userId: string,
    data: { profileImage?: string; bannerImage?: string },
  ): Promise<Pick<User, 'profileImage' | 'bannerImage'>>;
  createProfile(
    createProfile: UserProfileEntity,
  ): Promise<UserProfileEntity | null>;
  findById(userId: string): Promise<UserProfileEntity | null>;
  updateProfile(
    userId: string,
    data: UserProfileEntity,
  ): Promise<UserProfileEntity | null>;
  findByUserId(userId:string):Promise<UserProfileEntity|null>
}
