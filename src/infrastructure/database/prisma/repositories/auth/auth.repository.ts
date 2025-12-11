import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IAuthRepository } from 'src/domain/repositories/auth/auth.repository.interface';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private _prisma: PrismaService) {}

  // async findByOtp(otp: string): Promise<UserVerificationEntity | null> {
  //   const record = await this._prisma.userVerification.findFirst({
  //     where: { otp },
  //   });
  //   if (!record) return null;
  //   return userVerificationMapper.toDomain(record);
  // }
  // async deleteTempUser(id: string) {
  //   return this._prisma.userVerification.delete({ where: { id } });
  // }
  async resetPassword(
    email: string,
    data: { password: string },
  ): Promise<UserEntity | null> {
    try {
      console.log(email, 'email in reset password repo');
      console.log(data.password, 'in password repo');

      const resetPassword = await this._prisma.user.update({
        where: { email },
        data,
      });
      return UserMapper.toDomain(resetPassword);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async logout(userId: string): Promise<UserEntity> {
    const d = await this._prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    console.log(d, 'ddddd');
    return UserMapper.toDomain(d);
  }
}
