import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
// import { Agency } from '@prisma/client';
import { AddPackageDto } from 'src/application/dtos/add-package.dto';
import { UpdateAgencyProfileDto } from 'src/application/dtos/update-agency-profile.dto';
import { UpdateAgencyStatusDto } from 'src/application/dtos/update-agency.dto';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
import { IAgencyPackageService } from 'src/application/usecases/agency/interfaces/agency-package.interface';
import { IAgencyProfileService } from 'src/application/usecases/agency/interfaces/agency-profile.service.interface';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.service.interface';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { AGENCY_PACKAGE_TYPE, AGENCY_PROFILE_TYPE } from 'src/domain/types';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { Response } from 'express';
import { CreateAgencyDto } from 'src/application/dtos/create-agency.dto';
@Controller('agency')
export class AgencyController {
  constructor(
    @Inject('IAgencyService')
    private readonly agencyService: IAgencyService,
    @Inject(AGENCY_PACKAGE_TYPE.IAgencyPackageService)
    private readonly agencyPackageService: IAgencyPackageService,
    @Inject(AGENCY_PROFILE_TYPE.IAgencyProfileService)
    private readonly agencyProfileService: IAgencyProfileService,
  ) {}

  @Post('/signin')
  async signin(
    @Body() createAgencyDto:CreateAgencyDto,
    @Res({passthrough:true}) res:Response
  ){
    return this.agencyService.createAgency(createAgencyDto)
  }

  @Get()
  findAll() {
    return this.agencyService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/agency-profile')
  async updateAgencyProfile(
    @Body() updateAgencyProfileDto: UpdateAgencyProfileDto,
    @Req() req: RequestWithUser,
  ) {
    console.log('ee router l thanne aano avruune');

    let agencyId = req.user['userId']
    console.log(updateAgencyProfileDto, 'update agency profile dto');
    return await this.agencyProfileService.updateProfile(
      updateAgencyProfileDto,
      agencyId,
    );
  }

  @Get('/agency-profile')
  async getAgencyProfile(){
    return await this.agencyProfileService.getAgencyProfile()
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('photos')) 
  @Post('packages')
  async addPackages(
    @Body() addPackageDto: AddPackageDto,
    @UploadedFiles() files:Express.Multer.File[],
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log("packages l ehundooooooooo");
    
    let agencyId = req.user['userId'];
    return await this.agencyPackageService.addPackages(addPackageDto, agencyId,files);
  }
  @Get('packages')
  async getPackages(){
    return await this.agencyPackageService.getPackages()
  }

  @Patch('/profile/:id')
  updateProfile(@Param('id') id: string, @Body() updateData: UpdateAgencyStatusDto) {
    return this.agencyService.updateProfile(id, updateData);
  }

  // @Patch(':id') // :id/approval
  // agencyApproval(
  //   @Param('id') id: string,
  //   @Body() updateData: { status: AgencyStatus; email: string; name: string },
  // ) {
  //   return this.agencyService.agencyApproval(id, updateData);
  // }
}
