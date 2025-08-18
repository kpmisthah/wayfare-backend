export interface ICloudinaryService {
  uploadImage(file: Express.Multer.File): Promise<string>;
}
