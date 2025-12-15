import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IAuthRepository } from '../../../../../domain/repositories/auth/auth.repository.interface';
import { UserEntity } from '../../../../../domain/entities/user.entity';
import { UserMapper } from '../../../../mappers/user.mapper';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private _prisma: PrismaService) {}

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
