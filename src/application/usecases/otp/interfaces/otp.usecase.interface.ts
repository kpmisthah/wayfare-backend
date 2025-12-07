export interface IOtpService {
  sendOtp(
    email: string,
    name: string,
    password: string,
    role: string,
    phone?: string,
  ): Promise<void>;
  agencyVerification(email: string, loginLink: string): Promise<void>;
  sendForgotPasswordOtp(email: string):Promise<void>
}
