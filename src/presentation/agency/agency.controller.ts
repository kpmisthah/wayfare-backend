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
import { PackageStatus } from 'src/domain/enums/package-status.enum';
import { BankDetailsDto } from 'src/application/dtos/request-payout.dto';
import { IBankingDetailsUsecase } from 'src/application/usecases/agency/interfaces/agnecy-banking-details.usecase.interface';
import { IWalletUseCase } from 'src/application/usecases/wallet/interfaces/wallet.usecase.interface';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';

@Controller('agency')
@UseGuards(AccessTokenGuard,RolesGuard)
@Roles(Role.Agency)
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
    @Inject('IBankingDetailsUsecase')
    private readonly _bankingDetailsUsecase: IBankingDetailsUsecase,
    @Inject('IWalletUseCase')
    private readonly _walletUseCase: IWalletUseCase,
  ) {}
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

  @UseInterceptors(FilesInterceptor('photos'))
  @Post('add/packages')
  async addPackages(
    @Body() addPackageDto: PackageDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: RequestWithUser,
  ) {
    console.log('post--------------------------adikkndoooo-------------');
    const userId = req.user['userId'];

    const parsedBody: PackageDto = {
      ...addPackageDto,
      itinerary: JSON.parse(addPackageDto.itinerary as unknown as string),
    };
    console.log(parsedBody, 'parsedBodyyyyyyyy');
    return await this._agencyPackageUsecase.addPackages(
      parsedBody,
      userId,
      files,
    );
  }

  @Get('get/packages')
  async getPackages(
    @Req() req: RequestWithUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    console.log('get adikkndooo-------------------------');

    const userId = req.user['userId'];
    return await this._agencyPackageUsecase.getPackages(userId, +page, +limit);
  }

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
  async findAll() {
    return this._agencyUsecase.getAllAgencies();
  }
  @Get('/filter/packages')
  async filterPackages(@Query() filterPackageDto: FilterPackageDto) {
    console.log('hello');

    return await this._agencyPackageUsecase.filterPackages(filterPackageDto);
  }
  @Put('/package/:id')
  async updatePackage(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    console.log(id, 'id in packageid');
    return await this._agencyPackageUsecase.updatePackage(id, updatePackageDto);
  }
  @Patch('/package/status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: PackageStatus,
  ) {
    return await this._agencyPackageUsecase.updatePackageStatus(id, status);
  }

  @Get('/trending/packages')
  async trendingPackages() {
    const result = await this._agencyPackageUsecase.trendingPackages();
    console.log(result, 'result');
    return result;
  }

  @Get('/me')
  async getAgency(@Req() req: RequestWithUser) {
    const agencyId = req.user['userId'];
    console.log(agencyId, 'agencyIddd');
    return await this._agencyProfileUsecase.findProfile(agencyId);
  }

  @Get('/search')
  async search(
    @Query('q') query: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortBy') sortBy: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    return this._agencyUsecase.searchAgencies(query, pageNum, limitNum, sortBy);
  }

  @Get('/wallet')
  async getWalletSummary(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this._walletUseCase.getWalletSummary(userId);
  }
  @Get('/recent-booking')
  async getRecent(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this._walletUseCase.getRecentTransaction(userId);
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
    @Param('agencyId') agencyId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    console.log('Hellooooooo agecnyId');
    const pageNumber = page ? Number(page) : 1;
    console.log(pageNumber, 'pageNumber');

    const limitNumber = limit ? Number(limit) : 1;
    console.log(limitNumber, 'limitNumber');

    const data = await this._agencyPackageUsecase.getPackagesByAgencyId(
      agencyId,
      pageNumber,
      limitNumber,
    );
    console.log(data, 'in agencyId/packages');
    return data;
  }

  @Get('/:packageId/package-details')
  async getPackageDetails(@Param('packageId') packageId: string) {
    return this._agencyPackageUsecase.getPackageDetails(packageId);
  }

  @Get('/:agencyId')
  async getAgencyById(@Param('agencyId') agencyId: string) {
    return this._agencyUsecase.findById(agencyId);
  }

  @Patch(':id')
  async agencyApproval(
    @Param('id') id: string,
    @Body() body: { action: 'accept' | 'reject'; reason?: string },
  ) {
    // let id = req.user['userId']
    console.log(id, 'id');
    const { action, reason } = body;
    console.log(action, 'action');
    console.log(reason, 'reason');
    return await this._agencyUsecase.agencyApproval(id, action, reason);
  }
  @Get('/bank/details')
  async getAgencyBankDetails(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    console.log(userId, 'userIddd');
    return await this._bankingDetailsUsecase.getBankDetailsByAgency(userId);
  }
  @Post('/bank-details')
  async agencyBankDetails(@Body() bankDetailsDto: BankDetailsDto) {
    return await this._bankingDetailsUsecase.bankDetails(bankDetailsDto);
  }
  @Patch('/update/bankdetails')
  async updateBankDetails(
    @Req() req: RequestWithUser,
    @Body() updateBankDetailsDto: Partial<BankDetailsDto>,
  ) {
    const userId = req.user['userId'];
    return await this._bankingDetailsUsecase.updateBankDetails(
      userId,
      updateBankDetailsDto,
    );
  }
}
