import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IProfileRepository } from '../../../../../domain/repositories/user/profile.repository.interface';
import { User } from '@prisma/client';
import { UserProfileMapper } from '../../../../mappers/user-profile.mapper';
import { UserProfileEntity } from '../../../../../domain/entities/user-profile.entity';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(private readonly _prisma: PrismaService) {}
  async findById(userId: string): Promise<UserProfileEntity | null> {
    console.log(userId, 'userIddds');
    const profile = await this._prisma.userProfile.findFirst({
      where: {
        userId,
      },
    });
    if (!profile) return null;
    return UserProfileMapper.toDomain(profile);
  }
  async getUserData(id: string): Promise<UserProfileEntity | null> {
    const userProfile = await this._prisma.userProfile.findFirst({
      where: { userId: id },
    });
    if (!userProfile) return null;
    return UserProfileMapper.toDomain(userProfile);
  }
  async createProfile(
    createProfile: UserProfileEntity,
  ): Promise<UserProfileEntity | null> {
    const userProfile = await this._prisma.userProfile.create({
      data: UserProfileMapper.toPrisma(createProfile),
    });
    if (!userProfile) {
      return null;
    }
    return UserProfileMapper.toDomain(userProfile);
  }

  async updateProfileImage(
    userId: string,
    data: { profileImage?: string; bannerImage?: string },
  ): Promise<Pick<User, 'profileImage' | 'bannerImage'>> {
    console.log('updateProfile l ethundo');

    return await this._prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.profileImage && { profileImage: data.profileImage }),
        ...(data.bannerImage && { bannerImage: data.bannerImage }),
      },
      select: {
        profileImage: true,
        bannerImage: true,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: UserProfileEntity,
  ): Promise<UserProfileEntity | null> {
    const updateUserProfile = await this._prisma.userProfile.upsert({
      where: { userId },
      update: {
        location: data.location,
        phone: data.phone,
      },
      create: UserProfileMapper.toPrisma(data),
    });
    if (!updateUserProfile) return null;
    return UserProfileMapper.toDomain(updateUserProfile);
  }
  async findByUserId(userId: string): Promise<UserProfileEntity | null> {
    const userProfile = await this._prisma.userProfile.findFirst({
      where: { userId },
    });
    if (!userProfile) return null;
    return UserProfileMapper.toDomain(userProfile);
  }
}
