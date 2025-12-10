export interface IUploadProfileUseCase {
  execute(
    userId: string,
    file: Express.Multer.File,
    type: 'profile' | 'banner',
  ): Promise<string>;
}
