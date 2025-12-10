import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from 'src/application/usecases/profile/implementation/profile.usecase';
import { PROFILE_TYPE } from 'src/domain/types';
import { UploadProfileUseCase } from 'src/application/usecases/profile/implementation/upload-profile.usecase';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: PROFILE_TYPE.IProfileService,
      useClass: ProfileService,
    },
    {
      provide:"IUploadProfileUsecase",
      useClass:UploadProfileUseCase,
    }
  ],
  exports: [PROFILE_TYPE.IProfileService, "IUploadProfileUsecase"],
})
export class ProfileModule {}
