import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from '../../application/usecases/profile/implementation/profile.usecase';
import { PROFILE_TYPE } from '../../domain/types';
import { UploadProfileUseCase } from '../../application/usecases/profile/implementation/upload-profile.usecase';
import { CloudinaryModule } from '../../infrastructure/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: PROFILE_TYPE.IProfileService,
      useClass: ProfileService,
    },
    {
      provide: 'IUploadProfileUsecase',
      useClass: UploadProfileUseCase,
    },
  ],
  exports: [PROFILE_TYPE.IProfileService, 'IUploadProfileUsecase'],
})
export class ProfileModule {}
