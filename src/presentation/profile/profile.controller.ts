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
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { CreateProfileDto } from 'src/application/dtos/create-profile.dto';
import { IProfileService } from 'src/application/usecases/profile/interfaces/profile.usecase.interface';
import { PROFILE_TYPE } from 'src/domain/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProfileUseCase } from 'src/application/usecases/profile/implementation/upload-profile.usecase';
@Controller('user')
export class ProfileController {
  constructor(
    @Inject(PROFILE_TYPE.IProfileService)
    @Inject('IProfileService')
    private readonly profileService: IProfileService,
    
    private readonly uploadProfile:UploadProfileUseCase
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get('/profile')
  async getProfileData(@Req() req:RequestWithUser){
    console.log("Controller Hit");
    const userId = req.user['userId'];
    console.log(userId,'userId')
    return await this.profileService.getProfileData(userId)
  }

  @UseGuards(AccessTokenGuard)
  @Post('/profile')
  async createProfile(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    try {
      const userId = req.user['userId'];    
      console.log(createProfileDto, 'in backedn controller');
      return await this.profileService.createProfile(userId, createProfileDto);
    } catch (error) {
      console.log(error, 'error in ocntroller');
      throw new InternalServerErrorException('Failed to create Profile');
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('upload-profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileHandler(
    @Req() req:RequestWithUser,
    @UploadedFile() file:Express.Multer.File,
    @Body('type') type:'profile'|'banner'
){
  console.log(file)
  const userId = req.user['userId']
  console.log(userId,'userId in upload-profile');
  const imageUrl = await this.uploadProfile.execute(userId,file,type)
  console.log(imageUrl,'img url')
  
  return {imageUrl}
  }
  @UseGuards(AccessTokenGuard)
  @Put('/update-profile-image')
  async updateProfileImage(@Req() req:RequestWithUser,imageUrl:string){
    console.log("profile controller");
    const userId = req.user['userId']
    console.log(userId,'profile controller l userId');
    
    return this.profileService.updateProfileImage(userId,imageUrl)
  }

  @UseGuards(AccessTokenGuard)
  @Put('/update-profile')
  async updateProfile(@Req() req:RequestWithUser,@Body() data:{name:string,email:string,phone:string,location:string}){
    console.log("update profile l");
    const userId = req.user['userId']
    return await this.profileService.updateProfile(userId,data)
    
  }
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async getUserProfile(@Req() req){
    let userPr = await this.profileService.findById(req.user.userId)
    console.log(userPr,'user{rofile');
    return userPr
    
  }
}
