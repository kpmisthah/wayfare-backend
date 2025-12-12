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
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';

@Controller('payment')
@UseGuards(AccessTokenGuard, RolesGuard) 
export class PaymentController {
  constructor(
    @Inject('IBookingUseCase')
    private readonly _bookingUsecase: IBookingUseCase,
    @Inject('ICreatePayoutRequestUsecase')
    private readonly _payoutRequestUsecase: ICreatePayoutRequestUsecase,
  ) {}

  @Get(':id')
  @Roles(Role.User, Role.Agency) 
  async paymentVerification(
    @Param('id') id: string,
  ): Promise<{ status: PaymentStatus } | null> {
    console.log(id, 'id');
    return await this._bookingUsecase.paymentVerification(id);
  }

  @Post('payout')
  @Roles(Role.Agency) 
  async request(
    @Body() dto: PayoutRequestDto,
  ): Promise<PayoutRequestDto | null> {
    console.log(dto, 'dtoo');
    return this._payoutRequestUsecase.execute(dto);
  }
}
