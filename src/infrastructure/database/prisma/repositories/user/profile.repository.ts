import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IProfileRepository } from 'src/domain/repositories/user/profile.repository.interface';
import { User } from '@prisma/client';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';
import { UserProfileMapper } from 'src/infrastructure/mappers/user-profile.mapper';
import { UserProfileEntity } from 'src/domain/entities/user-profile.entity';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(userId:string):Promise<UserProfileEntity|null>{
    console.log(userId,'userIddds');
    let profile = await this.prisma.userProfile.findFirst({where:{
      userId
    }})
    if(!profile) return null
    return UserProfileMapper.toDomain(profile)
  }
  async getUserData(id:string):Promise<UserProfileEntity|null>{
  //ividenn preferences ozhivaaaakiiii
    //  let res = await this.prisma.user.findUnique({
    //   where:{id},
    //   select:{
    //     id:true,
    //     name:true,
    //     email:true,
    //     phone:true,
    //     location:true,
    //     profileImage:true,
    //     bannerImage:true,
    //     preferences:{
    //       select:{
    //         id:true,
    //         name:true
    //       }
    //     }
    //   }
    // })
    // console.log(res,'in repository')
    // return res
  // }
  let userProfile = await this.prisma.userProfile.findFirst({ where:{userId:id}})
  if(!userProfile) return null
  return UserProfileMapper.toDomain(userProfile)
  }
  async createProfile(createProfile: UserProfileEntity):Promise<UserProfileEntity|null> {

    let userProfile = await this.prisma.userProfile.create({
      data: UserProfileMapper.toPrisma(createProfile)
    });
    if(!userProfile){
      return null
    }
    return UserProfileMapper.toDomain(userProfile)
  }

  async updateProfileImage(userId:string,data:{profileImage?:string;bannerImage?:string}):Promise<Pick<User,'profileImage'|'bannerImage'>>{
    console.log("updateProfile l ethundo");
    
    return await this.prisma.user.update({
      where:{id:userId},
      data:{
        ...(data.profileImage && {profileImage:data.profileImage}),
        ...(data.bannerImage && {bannerImage:data.bannerImage})
      },
      select:{
        profileImage:true,
        bannerImage:true
      }
    })
  }

  async updateProfile(userId:string,data:UserProfileEntity):Promise<UserProfileEntity|null>{
    let updateUserProfile = await this.prisma.userProfile.upsert({
      where:{userId},
      update:{
        location:data.location,
        phone:data.phone
      },
      create:UserProfileMapper.toPrisma(data)
     // select:{
      //   name:true,
      //   email:true,
      //   phone:true,
      //   location:true,
      //   preferences:{
      //     select:{
      //       id:true,
      //       name:true
      //     }
      //   }
      // }
    })
    if(!updateUserProfile) return null
    return UserProfileMapper.toDomain(updateUserProfile)
  }
}
