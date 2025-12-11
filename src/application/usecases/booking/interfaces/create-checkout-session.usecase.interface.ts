export interface ICreateCheckoutSession {
  execute(
    command: {
      bookingId?: string;
      successUrl: string;
      cancelUrl: string;
    },
    userId: string,
  ): Promise<{ url: string }>;
}
