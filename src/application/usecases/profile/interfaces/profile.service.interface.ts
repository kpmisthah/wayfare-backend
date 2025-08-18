import { User } from '@prisma/client';
import { CreateProfileDto } from 'src/application/dtos/create-profile.dto';
import { GetProfileDto } from 'src/application/dtos/get-profile.dto';
import { UpdateUserProfileDto } from 'src/application/dtos/update-user-profile.dto';
import { UserProfileDto } from 'src/application/dtos/user-profile.dto';
export interface IProfileService {
  getProfileData(id:string):Promise<GetProfileDto|null>
 createProfile(id: string,createProfileDto: CreateProfileDto):Promise<UserProfileDto|null>
  updateProfileImage(userId,imageUrl:string):Promise<Pick<User,'profileImage'|'bannerImage'>>  
 updateProfile(userId:string,updateUserProfileDto:UpdateUserProfileDto):Promise<UpdateUserProfileDto|null>
 findById(userId:string):Promise<UpdateUserProfileDto|null>
}
