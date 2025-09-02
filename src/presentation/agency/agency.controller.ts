import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PackageDto } from 'src/application/dtos/add-package.dto';
import { UpdateAgencyProfileDto } from 'src/application/dtos/update-agency-profile.dto';
import { UpdateAgencyStatusDto } from 'src/application/dtos/update-agency.dto';
import { IAgencyPackageService } from 'src/application/usecases/agency/interfaces/agency-package.interface';
import { IAgencyProfileService } from 'src/application/usecases/agency/interfaces/agency-profile.service.usecase';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.usecase.interface';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { ADMIN_TYPE, AGENCY_PACKAGE_TYPE, AGENCY_PROFILE_TYPE } from 'src/domain/types';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { Response } from 'express';
import { CreateAgencyDto } from 'src/application/dtos/create-agency.dto';
import { IUserService } from 'src/application/usecases/users/interfaces/user.usecase.interface';
import { IAdminService } from 'src/application/usecases/admin/interfaces/admin.usecase.interface';
import { AgencyProfileDto } from 'src/application/dtos/agency-profile.dto';
@Controller('agency')
export class AgencyController {
  constructor(
    @Inject('IAgencyService')
    private readonly agencyService: IAgencyService,
    @Inject(AGENCY_PACKAGE_TYPE.IAgencyPackageService)
    private readonly agencyPackageService: IAgencyPackageService,
    @Inject(AGENCY_PROFILE_TYPE.IAgencyProfileService)
    private readonly agencyProfileService: IAgencyProfileService,
    @Inject(ADMIN_TYPE.IAdminService)
    private readonly adminService:IAdminService
  ) {}

  // @Post('/signin')
  // async signin(
  //   @Body() createAgencyDto:CreateAgencyDto,
  //   @Res({passthrough:true}) res:Response
  // ){
  //   return this.agencyService.createAgency(createAgencyDto)
  // }

  // @Get()
  // findAll() {
  //   return this.agencyService.findAll();
  // }

  @UseGuards(AccessTokenGuard)
  @Post('/agency-profile')
  async createAgencyProfile(
    @Body() createAgencyDto: CreateAgencyDto,
    @Req() req: RequestWithUser,
  ) {
    console.log('ee router l thanne aano avruune');
    let agencyId = req.user['userId'];
    console.log(createAgencyDto, 'update agency profile dto');
    return await this.agencyService.createAgency(createAgencyDto, agencyId);
  }

  //update agencyProfiles
  @UseGuards(AccessTokenGuard)
  @Patch('/agency-profile')
  async updateAgencyProfile(
    @Body() updateAgencyProfileDto: UpdateAgencyProfileDto,
    @Req() req: RequestWithUser,
  ) {
    let agencyId = req.user['userId'];
    return await this.agencyProfileService.updateProfile(
      agencyId,
      updateAgencyProfileDto,
    );
  }

  @Get('/agency-profile')
  async getAgencyProfile() {
    return await this.agencyProfileService.getAgencyProfile();
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('photos'))
  @Post('packages')
  async addPackages(
    @Body() addPackageDto: PackageDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    let userId = req.user['userId'];

      const parsedBody: PackageDto = {
    ...addPackageDto,
    itinerary: JSON.parse(addPackageDto.itinerary as unknown as string),
  };
    return await this.agencyPackageService.addPackages(
      parsedBody,
      userId,
      files,
    );
  }
  @Get('packages')
  async getPackages() {
    return await this.agencyPackageService.getPackages();
  }
  
  @UseGuards(AccessTokenGuard)
  @Get('/agencyPackages')
  async getPackage(@Req() req:RequestWithUser){
    let userId = req.user['userId']
    return await this.agencyPackageService.getAgencyPackages(userId)
  }
  @Patch('/profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateData: UpdateAgencyStatusDto,
  ) {
    return this.agencyService.updateProfile(id, updateData);
  }

    @UseGuards(AccessTokenGuard)
    @Patch() // :id/approval
    async agencyApproval(
      @Body() agencyDto:AgencyProfileDto
    ) {
      // let id = req.user['userId']
      return await this.agencyService.agencyApproval(agencyDto);
    }

  @Get('/agencies')
  async findAll(
    @Query('page') page:string = '1',
    @Query('limit') limit:string = "10",
    @Query('search') search:string
  ){
    return this.adminService.getAllAgencies()
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async getAgency(@Req() req: RequestWithUser) {
    let agencyId = req.user['userId']
    return this.agencyProfileService.findProfile(agencyId)
  }
}
