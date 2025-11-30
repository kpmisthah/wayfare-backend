import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider } from 'src/application/usecases/stripe/interface/payment.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements PaymentProvider {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly _configService: ConfigService) {
    const apiKey = this._configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(apiKey!, {
      apiVersion: '2025-08-27.basil',
    });
  }
  // async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
  //     throw new Error("Method not implemented.");
  // }
  // async createPaymentIntent(
  //   amount: number,
  //   currency: string,
  //   metadata?: Record<string, any>,
  // ): Promise<string> {
  //   const paymentIntent = await this.stripe.paymentIntents.create({
  //     amount,
  //     currency,
  //     metadata,
  //   });
  //   this.logger.log(
  //     `PaymentIntent created successfully with amount: ${amount} ${currency}`,
  //   );
  //   return paymentIntent.client_secret as string;
  // }
  // NEW: Create Checkout Session (this is what you need for retry!)
  async createCheckoutSession(params: {
    amount: number;
    currency: string;
    metadata: Record<string, any>;
    successUrl: string;
    cancelUrl: string;
    expiresAt?: number;
  }): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: 'Travel Package Booking',
            },
            unit_amount: params.amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      expires_at: params.expiresAt,
      metadata: params.metadata,
    });

    this.logger.log(`Checkout Session created: ${session.id}`);
    return session.url!; // This is the redirect URL
  }

  async confirmPayment(paymentIntentId: string): Promise<void> {
    await this.stripe.paymentIntents.confirm(paymentIntentId);
  }
  constructEvent(rawBody: Buffer, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(rawBody, sig, secret);
  }
}
