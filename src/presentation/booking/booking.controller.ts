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
import { CreateBookingDto } from 'src/application/dtos/create-booking.dto';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { IBookingUseCase } from 'src/application/usecases/booking/interfaces/bookiing.usecase.interface';
import { BookingStatus } from 'src/domain/enums/booking-status.enum';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';

@Controller('booking')
@UseGuards(AccessTokenGuard)
export class BookingController {
  constructor(
    @Inject('IBookingUseCase')
    private readonly _bookingUseCase: IBookingUseCase,
  ) {}
  @Post('/package')
  async createBooking(
    @Req() req: RequestWithUser,
    @Body() bookingDto: BookingDto,
    @Res({ passthrough: true }) res,
  ) {
    let userId = req.user['userId'];
    const result = await this._bookingUseCase.createBooking(bookingDto, userId);
    console.log(result, 'resultofbooking controllererrrrr');

    if (!result) {
      res.status(400);
      return { message: 'Booking failed' };
    }
    res.status(201);
    return result;
  }

  @Get('/get-bookings')
  async fetchBookings(@Req() req: RequestWithUser) {
    let userId = req.user['userId'];
    return await this._bookingUseCase.fetchBookings(userId);
  }

  @Get('/user')
  async getUserBookings(@Req() req: RequestWithUser,@Query('page')page?:string,@Query('limit')limit?:string) {
    let userId = req.user['userId'];
    const pageNumber = page? Number(page):1
    const limitNumber = limit? Number(limit):1
    return await this._bookingUseCase.getUserBookings(userId,pageNumber,limitNumber);
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
    const agencyId = req.user['userId']
    console.log(agencyId,'agencyId');
    
    return this._bookingUseCase.updateBookingStatus(
      bookingId,
      agencyId,
      body.status,
    );
  }

  @Get(":id/bookings")
  async getBookings(@Param("id") packageId: string) {
    return this._bookingUseCase.execute(packageId);
  }
}
