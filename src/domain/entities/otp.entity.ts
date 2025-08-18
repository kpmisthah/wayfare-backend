export class Otp {
  constructor(
    public code: string,
    public readonly expiresAt: Date,
  ) {}
  
  isValid(input: string): boolean {
    return this.code === input && this.expiresAt > new Date();
  }

  isMatch(providedOtp: string): boolean {
    return this.code === providedOtp;
  }
}
