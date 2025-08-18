import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateProfileDto } from 'src/application/dtos/create-profile.dto';
import { UserProfileDto } from 'src/application/dtos/user-profile.dto';
import { IProfileRepository } from 'src/domain/repositories/user/profile.repository.interface';
import { IProfileService } from 'src/application/usecases/profile/interfaces/profile.service.interface';
import {  UserProfileEntity } from 'src/domain/entities/user-profile.entity';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { PROFILE_TYPE } from 'src/domain/types';
import { UserMapper } from '../../mapper/user.mapper';
import { GetProfileDto } from 'src/application/dtos/get-profile.dto';
import { UpdateUserProfileDto } from 'src/application/dtos/update-user-profile.dto';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    @Inject(PROFILE_TYPE.IProfileRepository)
    private readonly profileRepo: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepo:IUserRepository
  ) {}

  async getProfileData(id:string):Promise<GetProfileDto|null>{
    console.log("service l ethundo ",id)
    let userEntity = await this.userRepo.findById(id)
    if(!userEntity){
      return null
    }
    let getProfile = await this.profileRepo.getUserData(id)
    if(!getProfile) return null
    return UserMapper.toUserProfileDto(getProfile,userEntity)
  }
  
  async createProfile(
    id: string,
    createProfileDto: CreateProfileDto,
  ):Promise<UserProfileDto|null>
   {
    let existingUser = await this.userRepo.findById(id)
    if(!existingUser){
      return null
    }

    let updateUser= existingUser.update(createProfileDto)
    await this.userRepo.update(id,updateUser)
    let userProfile = UserProfileEntity.createProfile(createProfileDto,id)
     let createUserProfileEntity = await this.profileRepo.createProfile(userProfile)
     if(!createUserProfileEntity) return null
     return UserMapper.toUserProfileDto(createUserProfileEntity,existingUser)
  }

  async updateProfileImage(userId:string,imageUrl:string):Promise<Pick<User,'profileImage'|'bannerImage'>>{
    console.log(imageUrl,'in profile service');
    return this.profileRepo.updateProfileImage(userId,{profileImage:imageUrl})
  }
  
  async updateProfile(userId:string,updateUserProfileDto:UpdateUserProfileDto):Promise<UpdateUserProfileDto|null>{
    let user = await this.userRepo.findById(userId)
    console.log(user,'from updateProfile in Backend');
    if(!user) return null
    let userRepoUpdate = user?.update(updateUserProfileDto)
    console.log(userRepoUpdate,'userUpdate..........')
    if(!userRepoUpdate){
      return null
    }
    let userRepoUpdated = await this.userRepo.update(userId,userRepoUpdate)
     console.log(userRepoUpdated,'userRepoUpdated broo');    
    const existingProfile = await this.profileRepo.findById(userId)
    let updateProfileEntity:UserProfileEntity
    if(existingProfile){
      updateProfileEntity = existingProfile.updateUserProfile(updateUserProfileDto)
    }else{
      updateProfileEntity = UserProfileEntity.createProfile(updateUserProfileDto,userId)
    }
    

    let updateUserProfile = await this.profileRepo.updateProfile(userId,updateProfileEntity)
    console.log(updateUserProfile,'updatedUserProfile');
    
    if(!updateUserProfile){
      return null
    }
    return UserMapper.toUserProfileUpdateDto(updateUserProfile,user)
  }

  async findById(userId:string):Promise<UpdateUserProfileDto|null>{
    let user = await this.userRepo.findById(userId)
    if(!user) return null
    let userProfile =  await this.profileRepo.findById(userId)
    if(!userProfile) return null
    return UserMapper.toUserProfileDto(userProfile,user)
  }
}
