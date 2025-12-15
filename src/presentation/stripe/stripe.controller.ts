import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  Req,
  Headers,
} from '@nestjs/common';
import { CreateBookingDto } from '../../application/dtos/create-booking.dto';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { IBookingUseCase } from '../../application/usecases/booking/interfaces/bookiing.usecase.interface';
import { StripeWebhookUsecase } from '../../application/usecases/stripe/implementation/webhook.usecase';

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

@Controller()
export class StripeController {
  private readonly _logger = new Logger(StripeController.name);
  constructor(
    @Inject('IBookingUseCase')
    private readonly _bookingUseCase: IBookingUseCase,
    private readonly _weebhookUseCase: StripeWebhookUsecase,
    @Inject('STRIPE_WEBHOOK_SECRET')
    private readonly webhookSecret: string,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest,
    @Headers('stripe-signature') signature: string,
  ) {
    console.log(
      '<...............................>webhook verndooooooo.....................................',
    );
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new Error('Raw body is missing');
    }
    return this._weebhookUseCase.handle(rawBody, signature, this.webhookSecret);
  }

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() dto: CreateBookingDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this._bookingUseCase.createBooking(dto, userId);
  }
}
