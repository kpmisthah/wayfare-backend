import { $Enums, UserVerification } from '@prisma/client';
import { UserVerificationEntity } from 'src/domain/entities/user-verification';
import { Role } from 'src/domain/enums/role.enum';

export class userVerificationMapper {
  static toDomain(user: UserVerification): UserVerificationEntity {
    return new UserVerificationEntity(
      user.id,
      user.name,
      user.email,
      user.otp,
      user.otp_expiry,
      user.password ?? '',
      user.role as Role,
      user.phone ?? '',
    );
  }

  static toPrisma(
    user: UserVerificationEntity,
  ): Omit<UserVerification, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: user.name,
      email: user.email,
      otp: user.otp,
      otp_expiry: user.otp_expiry,
      password: user.password,
      phone: user.phone,
      role: user.role as $Enums.Role,
    };
  }
}
