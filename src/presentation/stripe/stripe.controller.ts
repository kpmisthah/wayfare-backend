import { Body, Controller, Inject, Logger, Post, Req,Headers } from "@nestjs/common";
import { CreateBookingDto } from "src/application/dtos/create-booking.dto";
import { RequestWithUser } from "src/application/usecases/auth/interfaces/request-with-user";
import { IBookingUseCase } from "src/application/usecases/booking/interfaces/bookiing.usecase.interface";
import { StripeWebhookUsecase } from "src/application/usecases/stripe/implementation/webhook.usecase";

@Controller()
export class StripeController {
    private readonly _logger = new Logger(StripeController.name)
    constructor(
        @Inject('IBookingUseCase')
        private readonly _bookingUseCase:IBookingUseCase,
        private readonly _weebhookUseCase:StripeWebhookUsecase,
        @Inject('STRIPE_WEBHOOK_SECRET')
        private readonly webhookSecret:string
    ){}

    @Post('webhook')
    async handleWebhook(
        @Req() req:Request,
        @Headers('stripe-signature') signature:string
    ){
        const rawBody = (req as any).rawBody
        return this._weebhookUseCase.handle(rawBody,signature,this.webhookSecret)
    }

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() dto:CreateBookingDto,@Req() req:RequestWithUser){
        const userId = req.user['userId']
        return this._bookingUseCase.createBooking(dto,userId)
    }

}