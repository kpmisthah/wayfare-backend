import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { IBookingUseCase } from 'src/application/usecases/booking/interfaces/bookiing.usecase.interface';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';

@Controller('payment')
@UseGuards(AccessTokenGuard)
export class PaymentController {
  constructor(
    @Inject("IBookingUseCase")
    private readonly _bookingUsecase:IBookingUseCase
  ) {}

  @Get(':id')
  async paymentVerification(@Param('id') id: string) {
    console.log(id,'id')
    return await this._bookingUsecase.paymentVerification(id)
  }
}
