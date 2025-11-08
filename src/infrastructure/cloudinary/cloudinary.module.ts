import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [
    CloudinaryProvider,
    {
      provide: 'ICloudinaryService',
      useClass: CloudinaryService,
    },
  ],
  exports: ['ICloudinaryService'],
})
export class CloudinaryModule {}
