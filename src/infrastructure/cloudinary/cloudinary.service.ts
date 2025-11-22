import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { ICloudinaryService } from 'src/domain/repositories/cloudinary/cloudinary.service.interface';

@Injectable()
export class CloudinaryService implements ICloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('Uploading file:', file.originalname, 'size:', file.size);

    return new Promise((resolve, reject) => {
      try {
        const upload = cloudinary.uploader.upload_stream(
          { folder: 'profile-banners' },
          (error: any, result: UploadApiResponse) => {
            if (error) {
              console.error('Cloudinary error:', error);
              return reject(error);
            }
            if (!result) {
              console.error('Cloudinary returned no result');
              return reject(new Error('Upload failed with no result'));
            }
            console.log('Upload success, URL:', result.secure_url);
            resolve(result.secure_url);
          },
        );

        const stream = toStream(file.buffer);
        stream.on('error', (err) => {
          console.error('Stream error:', err);
          reject(err);
        });

        stream.pipe(upload);
      } catch (err) {
        console.error('Unexpected error during upload:', err);
        reject(err);
      }
    });
  }
}
