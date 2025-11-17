import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
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
import { IAgencyPackageService } from 'src/application/usecases/agency/interfaces/agency-package.interface';
import { IAgencyProfileService } from 'src/application/usecases/agency/interfaces/agency-profile.service.usecase';
import { IAgencyService } from 'src/application/usecases/agency/interfaces/agency.usecase.interface';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import {
  ADMIN_TYPE,
  AGENCY_PACKAGE_TYPE,
  AGENCY_PROFILE_TYPE,
} from 'src/domain/types';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { Response } from 'express';
import { CreateAgencyDto } from 'src/application/dtos/create-agency.dto';
import { IAdminService } from 'src/application/usecases/admin/interfaces/admin.usecase.interface';
import { FilterPackageDto } from 'src/application/dtos/filter-package.dto';
import { UpdatePackageDto } from 'src/application/dtos/update-package.dto';

@Controller('agency')
export class AgencyController {
  constructor(
    @Inject('IAgencyService')
    private readonly _agencyUsecase: IAgencyService,
    @Inject(AGENCY_PACKAGE_TYPE.IAgencyPackageService)
    private readonly _agencyPackageUsecase: IAgencyPackageService,
    @Inject(AGENCY_PROFILE_TYPE.IAgencyProfileService)
    private readonly _agencyProfileUsecase: IAgencyProfileService,
    @Inject(ADMIN_TYPE.IAdminService)
    private readonly _adminUsecase: IAdminService,
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
    const agencyId = req.user['userId'];
    console.log(createAgencyDto, 'update agency profile dto');
    return await this._agencyUsecase.createAgency(createAgencyDto, agencyId);
  }

  //update agencyProfiles
  @UseGuards(AccessTokenGuard)
  @Patch('/agency-profile')
  async updateAgencyProfile(
    @Body() updateAgencyProfileDto: UpdateAgencyProfileDto,
    @Req() req: RequestWithUser,
  ) {
    const agencyId = req.user['userId'];
    return await this._agencyProfileUsecase.updateProfile(
      agencyId,
      updateAgencyProfileDto,
    );
  }

  @Get('/agency-profile')
  async getAgencyProfile() {
    return await this._agencyProfileUsecase.getAgencyProfile();
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('photos'))
  @Post('add/packages')
  async addPackages(
    @Body() addPackageDto:PackageDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log("post--------------------------adikkndoooo-------------")
    const userId = req.user['userId'];

    const parsedBody: PackageDto = {
      ...addPackageDto,
      itinerary: JSON.parse(addPackageDto.itinerary as unknown as string),
    };
    console.log(parsedBody,'parsedBodyyyyyyyy')
    return await this._agencyPackageUsecase.addPackages(
      parsedBody,
      userId,
      files,
    );
  }
  @UseGuards(AccessTokenGuard)
  @Get('get/packages')
  async getPackages(@Req() req: RequestWithUser,@Query('page') page:string='1',@Query('limit') limit:string='5') {
    console.log('get adikkndooo-------------------------');
    
    const userId = req.user['userId'];
    return await this._agencyPackageUsecase.getPackages(userId,+page,+limit);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/agencyPackages')
  async getPackage(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this._agencyPackageUsecase.getAgencyPackages(userId);
  }
  @Patch('/profile/:id')
  updateProfile(@Param('id') id: string) {
    console.log(id, 'from agency');

    return this._agencyUsecase.updateStatus(id);
  }


  @Get('/agencies')
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: string,
    @Query('limit', new DefaultValuePipe(10)) limit: string,
    @Query('search') search: string,
  ) {
    return this._adminUsecase.getAllAgencies();
  }
    @Get('/filter/packages')
  async filterPackages(@Query() filterPackageDto:FilterPackageDto){
    console.log("hello");
    
    return this._agencyPackageUsecase.filterPackages(filterPackageDto)
  }
  @Put('/package/:id')
  async updatePackage(@Param('id') id:string,@Body() updatePackageDto:UpdatePackageDto){
    console.log(id,'id in packageid')
    return await this._agencyPackageUsecase.updatePackage(id,updatePackageDto)
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async getAgency(@Req() req: RequestWithUser) {
    const agencyId = req.user['userId'];
    return this._agencyProfileUsecase.findProfile(agencyId);
  }

  @Get('/search')
  async search(
    @Query('q') query: string,
    @Query('page') page:string,
    @Query('limit') limit:string
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    return this._agencyUsecase.searchAgencies(query,pageNum,limitNum);
  }
  // @Get()
  // async listAgencies(
  // @Query('page') page: string,
  // @Query('limit') limit: string
  // ) {
  //   const pageNum = parseInt(page) || 1;
  //   const limitNum = parseInt(limit) || 6;
  //   return this._agencyUsecase.listAgencies(pageNum,limitNum);
  // }
    @Get('/:agencyId/packages')
  async getAgencyPackages(
    @Param('agencyId') agencyId:string ,
    @Query('page') page?:string,
    @Query('limit') limit?:string
  ) {
    console.log("Hellooooooo agecnyId")
    const pageNumber = page? Number(page):1
    console.log(pageNumber,'pageNumber');
    
    const limitNumber = limit? Number(limit):1
    console.log(limitNumber,'limitNumber');
    
    let data = await this._agencyPackageUsecase.getPackagesByAgencyId(agencyId,pageNumber,limitNumber);
    console.log(data,'in agencyId/packages');
    return data
    
  }

  @Get('/:packageId/package-details')
  async getPackageDetails(@Param('packageId') packageId: string) {
    return this._agencyPackageUsecase.getPackageDetails(packageId);
  }

  @Get('/:agencyId')
  async getAgencyById(@Param('agencyId') agencyId: string) {
    return this._agencyUsecase.findById(agencyId);
  }
  @UseGuards(AccessTokenGuard)
  @Patch(':id') 
  async agencyApproval(@Param('id') id: string) {
    // let id = req.user['userId']
    console.log(id, 'id');

    return await this._agencyUsecase.agencyApproval(id);
  }


}
