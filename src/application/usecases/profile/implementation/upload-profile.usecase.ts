import { Inject, Injectable } from '@nestjs/common';
import { ICloudinaryService } from 'src/domain/repositories/cloudinary/cloudinary.service.interface';
import { PROFILE_TYPE } from 'src/domain/types';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { IProfileRepository } from 'src/domain/repositories/user/profile.repository.interface';

@Injectable()
export class UploadProfileUseCase {
  constructor(
    @Inject('ICloudinaryService')
    private readonly cloudinaryService: ICloudinaryService,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject(PROFILE_TYPE.IProfileRepository)
    private readonly profileRepo: IProfileRepository,
  ) {}

  async execute(
    userId: string,
    file: Express.Multer.File,
    type: 'profile' | 'banner',
  ): Promise<string> {
    console.log(file, 'file in service and userId', userId);
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    console.log(user);

    const imageUrl = await this.cloudinaryService.uploadImage(file);
    if (type == 'profile') {
      await this.profileRepo.updateProfileImage(userId, {
        profileImage: imageUrl,
      });
    } else {
      await this.profileRepo.updateProfileImage(userId, {
        bannerImage: imageUrl,
      });
    }

    return imageUrl;
  }
}
