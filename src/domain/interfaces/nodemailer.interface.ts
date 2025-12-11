export interface INodeMailerService {
  sendOtpToEmail(email: string): Promise<string>;
  sendForgotPasswordOtp(email: string, name: string): Promise<string>;
}
