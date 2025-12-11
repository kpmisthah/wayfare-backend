import { Injectable } from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { ICloudinaryService } from 'src/domain/repositories/cloudinary/cloudinary.service.interface';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService implements ICloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('Uploading file:', file.originalname, 'size:', file.size);

    return new Promise((resolve, reject) => {
      try {
        const upload = cloudinary.uploader.upload_stream(
          { folder: 'profile-banners' },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              console.error('Cloudinary error:', error);
              return reject(new Error(error.message));
            }
            if (!result) {
              console.error('Cloudinary returned no result');
              return reject(new Error('Upload failed with no result'));
            }
            console.log('Upload success, URL:', result.secure_url);
            resolve(result.secure_url);
          },
        );

        const stream = new Readable();
        stream.push(file.buffer);
        stream.push(null);

        stream.on('error', (err: Error) => {
          console.error('Stream error:', err);
          reject(new Error(String(err)));
        });

        stream.pipe(upload);
      } catch (err) {
        console.error('Unexpected error during upload:', err);
        reject(new Error(String(err)));
      }
    });
  }
}
