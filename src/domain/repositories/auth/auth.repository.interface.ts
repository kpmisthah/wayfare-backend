// import { User, UserVerification } from '@prisma/client';
import { UserEntity } from '../../entities/user.entity';

export interface IAuthRepository {
  // findByOtp(otp: string): Promise<UserVerificationEntity | null>;
  // deleteTempUser(id: string);
  resetPassword(
    email: string,
    data: { password: string },
  ): Promise<UserEntity | null>;
  logout(userId: string): Promise<UserEntity>;
}
