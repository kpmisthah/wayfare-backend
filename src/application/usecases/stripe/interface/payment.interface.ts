import Stripe from 'stripe';

export interface PaymentProvider {
  // createPaymentIntent(amount:number,currency:string,metadata?: Record<string, any>):Promise<string>
  confirmPayment(paymentIntentId: string): Promise<void>;
  constructEvent(rawBody: Buffer, sig: string, secret: string): Stripe.Event;
  createCheckoutSession(params: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
    successUrl: string;
    cancelUrl: string;
    expiresAt: number;
  }): Promise<string>;
}
