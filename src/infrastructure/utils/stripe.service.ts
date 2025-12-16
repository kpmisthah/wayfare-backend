import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider } from '../../application/usecases/stripe/interface/payment.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements PaymentProvider {
  private _stripe: Stripe;
  private readonly _logger = new Logger(StripeService.name);

  constructor(private readonly _configService: ConfigService) {
    const apiKey = this._configService.get<string>('STRIPE_SECRET_KEY');
    this._stripe = new Stripe(apiKey!, {
      apiVersion: '2025-08-27.basil',
    });
  }
  async createCheckoutSession(params: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
    successUrl: string;
    cancelUrl: string;
    expiresAt?: number;
  }): Promise<string> {
    const session = await this._stripe.checkout.sessions.create({
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

    this._logger.log(`Checkout Session created: ${session.id}`);
    return session.url!; // This is the redirect URL
  }

  async confirmPayment(paymentIntentId: string): Promise<void> {
    await this._stripe.paymentIntents.confirm(paymentIntentId);
  }
  constructEvent(rawBody: Buffer, sig: string, secret: string): Stripe.Event {
    return this._stripe.webhooks.constructEvent(rawBody, sig, secret);
  }
}
