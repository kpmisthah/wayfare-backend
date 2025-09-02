import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from 'src/application/usecases/profile/implementation/profile.service';
import { PROFILE_TYPE } from 'src/domain/types';
import { UploadProfileUseCase } from 'src/application/usecases/profile/implementation/upload-profile.service';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';

@Module({
  imports:[CloudinaryModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: PROFILE_TYPE.IProfileService,
      useClass: ProfileService,
    },
    UploadProfileUseCase
  ],
  exports:[
    PROFILE_TYPE.IProfileService,
    UploadProfileUseCase
  ]
})
export class ProfileModule {}
