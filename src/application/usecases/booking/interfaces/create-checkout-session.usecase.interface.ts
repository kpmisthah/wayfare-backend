import { RetryPaymentDto } from "src/application/dtos/retry-payment.dto";

export interface ICreateCheckoutSession{
    execute(
    command: {
      bookingId?: string;
      successUrl: string;
      cancelUrl: string;
    },
    userId: string,
  ): Promise<{ url: string }> 
}