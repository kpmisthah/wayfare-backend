import { Inject, Injectable } from '@nestjs/common';
import { ICloudinaryService } from '../../../../domain/repositories/cloudinary/cloudinary.service.interface';
import { PROFILE_TYPE } from '../../../../domain/types';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { IProfileRepository } from '../../../../domain/repositories/user/profile.repository.interface';
import { IUploadProfileUseCase } from '../interfaces/uplaod-profile.usecase.interface';

@Injectable()
export class UploadProfileUseCase implements IUploadProfileUseCase {
  constructor(
    @Inject('ICloudinaryService')
    private readonly _cloudinaryService: ICloudinaryService,
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    @Inject(PROFILE_TYPE.IProfileRepository)
    private readonly _profileRepo: IProfileRepository,
  ) {}

  async execute(
    userId: string,
    file: Express.Multer.File,
    type: 'profile' | 'banner',
  ): Promise<string> {
    console.log(file, 'file in service and userId', userId);
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    console.log(user);

    const imageUrl = await this._cloudinaryService.uploadImage(file);
    if (type == 'profile') {
      await this._profileRepo.updateProfileImage(userId, {
        profileImage: imageUrl,
      });
    } else {
      await this._profileRepo.updateProfileImage(userId, {
        bannerImage: imageUrl,
      });
    }

    return imageUrl;
  }
}
