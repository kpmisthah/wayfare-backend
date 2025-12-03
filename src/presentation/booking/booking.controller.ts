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
import { BookingDto } from 'src/application/dtos/booking.dto';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { IBookingUseCase } from 'src/application/usecases/booking/interfaces/bookiing.usecase.interface';
import { ICreateCheckoutSession } from 'src/application/usecases/booking/interfaces/create-checkout-session.usecase.interface';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';
import { StatusCode } from 'src/domain/enums/status-code.enum';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';

@Controller('booking')
@UseGuards(AccessTokenGuard)
export class BookingController {
  constructor(
    @Inject('IBookingUseCase')
    private readonly _bookingUseCase: IBookingUseCase,
    @Inject('ICreateCheckoutSessionUseCase')
    private readonly _createCheckoutSessionUseCase: ICreateCheckoutSession,
  ) {}
  @Post('/package')
  async createBooking(
    @Req() req: RequestWithUser,
    @Body() bookingDto: BookingDto,
    @Res({ passthrough: true }) res,
  ) {
    const userId = req.user['userId'];
    const result = await this._bookingUseCase.createBooking(bookingDto, userId);
    console.log(result, 'resultofbooking controllererrrrr');
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
  async fetchBookings(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this._bookingUseCase.fetchBookings(userId);
  }

  @Get('/user')
  async getUserBookings(
    @Req() req: RequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user['userId'];
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 1;
    return await this._bookingUseCase.getUserBookings(
      userId,
      pageNumber,
      limitNumber,
    );
  }

  @Post('/cancel/:id')
  async cancelBooking(@Param('id') id: string) {
    console.log(id, 'in booking.controller.ts');
    return await this._bookingUseCase.cancelBooking(id);
  }

  @Patch('/update-status/:id')
  async updateBookingStatus(
    @Param('id') bookingId: string,
    @Body() body: { status: BookingStatus },
    @Req() req: RequestWithUser,
  ) {
    const agencyId = req.user['userId'];
    console.log(agencyId, 'agencyId');

    return this._bookingUseCase.updateBookingStatus(
      bookingId,
      agencyId,
      body.status,
    );
  }
  @Post('retry-payment')
  async retryPayment(
    @Req() req: RequestWithUser,
    @Body() { bookingId }: { bookingId: string },
  ) {
    const userId = req.user['userId'];
    const result = await this._bookingUseCase.retryPayment(bookingId, userId);
    console.log(result, 'in retry payment');
    return result;
  }

  @Get(':id/my-booking')
  async getMyBookingDetails(@Param('id') id: string) {
    return this._bookingUseCase.getUserBookingDetails(id);
  }
  @Get(':id/bookings')
  async getBookings(@Param('id') packageId: string) {
    return this._bookingUseCase.execute(packageId);
  }
}
