import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PayoutRequestDto } from 'src/application/dtos/payout-request.dto';
import { IBookingUseCase } from 'src/application/usecases/booking/interfaces/bookiing.usecase.interface';
import { ICreatePayoutRequestUsecase } from 'src/application/usecases/payment/interfaces/create-payout.usecase.interface';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';

@Controller('payment')
@UseGuards(AccessTokenGuard)
export class PaymentController {
  constructor(
    @Inject('IBookingUseCase')
    private readonly _bookingUsecase: IBookingUseCase,
    @Inject('ICreatePayoutRequestUsecase')
    private readonly _payoutRequestUsecase: ICreatePayoutRequestUsecase,
  ) {}

  @Get(':id')
  async paymentVerification(@Param('id') id: string) {
    console.log(id, 'id');
    return await this._bookingUsecase.paymentVerification(id);
  }

  @Post('payout')
  async request(@Body() dto: PayoutRequestDto) {
    console.log(dto, 'dtoo');
    return this._payoutRequestUsecase.execute(dto);
  }
}
