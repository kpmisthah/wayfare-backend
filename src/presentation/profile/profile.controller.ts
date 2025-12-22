import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../../domain/enums/role.enum';
import { CreateProfileDto } from '../../application/dtos/create-profile.dto';
import { IProfileService } from '../../application/usecases/profile/interfaces/profile.usecase.interface';
import { PROFILE_TYPE } from '../../domain/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProfileUseCase } from '../../application/usecases/profile/implementation/upload-profile.usecase';

@Controller('user')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.User)
export class ProfileController {
  constructor(
    @Inject(PROFILE_TYPE.IProfileService)
    private readonly profileService: IProfileService,

    @Inject('IUploadProfileUsecase')
    private readonly uploadProfile: UploadProfileUseCase,
  ) {}

  @Get('/profile')
  async getProfileData(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this.profileService.getProfileData(userId);
  }

  @Post('/profile')
  async createProfile(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    try {
      const userId = req.user['userId'];
      return await this.profileService.createProfile(userId, createProfileDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create Profile');
    }
  }

  @Post('upload-profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileHandler(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: 'profile' | 'banner',
  ) {
    const userId = req.user['userId'];
    const imageUrl = await this.uploadProfile.execute(userId, file, type);

    return { imageUrl };
  }
  @Put('/update-profile-image')
  async updateProfileImage(
    @Req() req: RequestWithUser,
    @Body('imageUrl') imageUrl: string,
  ) {
    const userId = req.user['userId'];

    return this.profileService.updateProfileImage(userId, imageUrl);
  }

  @Put('/update-profile')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body()
    data: { name: string; email: string; phone: string; location: string },
  ) {
    const userId = req.user['userId'];
    return await this.profileService.updateProfile(userId, data);
  }
  @Get('/me')
  async getUserProfile(@Req() req: RequestWithUser) {
    const userPr = await this.profileService.findById(req.user.userId);
    return userPr;
  }
}
