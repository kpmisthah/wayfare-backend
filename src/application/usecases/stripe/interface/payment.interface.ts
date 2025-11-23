export interface PaymentProvider {
  // createPaymentIntent(amount:number,currency:string,metadata?: Record<string, any>):Promise<string>
  confirmPayment(paymentIntentId: string): Promise<void>;
  constructEvent(rawBody: Buffer, sig: string, secret: string)
  createCheckoutSession(params: {
    amount: number;
    currency: string;
    metadata: any;
    successUrl: string;
    cancelUrl: string;
    expiresAt: number;
  }): Promise<string>;
}