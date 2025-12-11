import { GoogleLoginResponse } from 'src/application/dtos/google-login-response.dto';

export interface IGoogleLoginUseCase {
  execute(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }): Promise<GoogleLoginResponse>;
}
