export interface INodeMailerService {
  sendOtpToEmail(email: string): Promise<string>;
}
