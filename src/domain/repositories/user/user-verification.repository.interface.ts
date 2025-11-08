import { UserVerificationEntity } from 'src/domain/entities/user-verification';

export interface IUserVerification {
  create(
    userVerifyEntity: UserVerificationEntity,
  ): Promise<UserVerificationEntity | null>;
  findEmail(email: string): Promise<UserVerificationEntity | null>;
  updateOtp(
    email: string,
    data: UserVerificationEntity,
  ): Promise<UserVerificationEntity>;
}
