// import { User, UserVerification } from '@prisma/client';
import { UserVerificationEntity } from 'src/domain/entities/user-verification';
import { UserEntity } from 'src/domain/entities/user.entity';

export interface IAuthRepository {
  findByOtp(otp: string): Promise<UserVerificationEntity | null>
  deleteTempUser(id: string)
  resetPassword(
    email: string,
    data: { password: string },
  ): Promise<UserEntity | null>;
  logout(userId)
}
