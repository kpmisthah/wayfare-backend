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
  UseGuards,
} from '@nestjs/common';
import { BookingDto } from '../../application/dtos/booking.dto';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { IBookingUseCase } from '../../application/usecases/booking/interfaces/bookiing.usecase.interface';
import { ICreateCheckoutSession } from '../../application/usecases/booking/interfaces/create-checkout-session.usecase.interface';
import { BookingStatus } from '../../domain/enums/booking-status.enum';
import { StatusCode } from '../../domain/enums/status-code.enum';
import { Role } from '../../domain/enums/role.enum';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Response } from 'express';

@Controller('booking')
@UseGuards(AccessTokenGuard, RolesGuard)
export class BookingController {
  constructor(
    @Inject('IBookingUseCase')
    private readonly _bookingUseCase: IBookingUseCase,
    @Inject('ICreateCheckoutSessionUseCase')
    private readonly _createCheckoutSessionUseCase: ICreateCheckoutSession,
  ) {}
  @Post('/package')
  @Roles(Role.User)
  async createBooking(
    @Req() req: RequestWithUser,
    @Body() bookingDto: BookingDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Response> {
    const userId = req.user['userId'];
    const result = await this._bookingUseCase.createBooking(bookingDto, userId);
    if (!result) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: 'Booking failed' });
    }
    return res.status(StatusCode.CREATED).json({
      bookingId: result.booking.id,
      checkoutUrl: result.checkoutUrl,
    });
  }

  @Get('/get-bookings')
  @Roles(Role.Agency)
  async fetchBookings(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this._bookingUseCase.fetchBookings(userId);
  }

  @Get('/user')
  @Roles(Role.User)
  async getUserBookings(
    @Req() req: RequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const userId = req.user['userId'];
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    return await this._bookingUseCase.getUserBookings(
      userId,
      pageNumber,
      limitNumber,
      search,
      status,
    );
  }

  @Post('/cancel/:id')
  @Roles(Role.User)
  async cancelBooking(@Param('id') id: string) {
    return await this._bookingUseCase.cancelBooking(id);
  }

  @Patch('/update-status/:id')
  @Roles(Role.Agency)
  async updateBookingStatus(
    @Param('id') bookingId: string,
    @Body() body: { status: BookingStatus },
    @Req() req: RequestWithUser,
  ) {
    const agencyId = req.user['userId'];

    return this._bookingUseCase.updateBookingStatus(
      bookingId,
      agencyId,
      body.status,
    );
  }
  @Post('retry-payment')
  @Roles(Role.User)
  async retryPayment(
    @Req() req: RequestWithUser,
    @Body() { bookingId }: { bookingId: string },
  ) {
    const userId = req.user['userId'];
    const result = await this._bookingUseCase.retryPayment(bookingId, userId);
    return result;
  }

  @Get(':id/my-booking')
  @Roles(Role.User, Role.Agency)
  async getMyBookingDetails(@Param('id') id: string) {
    return this._bookingUseCase.getUserBookingDetails(id);
  }
  @Get(':id/bookings')
  @Roles(Role.Agency)
  async getBookings(
    @Param('id') packageId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '10');
    return this._bookingUseCase.execute(packageId, pageNum, limitNum, search);
  }
}
