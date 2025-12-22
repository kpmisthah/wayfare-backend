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
      const resetPassword = await this._prisma.user.update({
        where: { email },
        data,
      });
      return UserMapper.toDomain(resetPassword);
    } catch (error) {
      return null;
    }
  }
  async logout(userId: string): Promise<UserEntity> {
    const d = await this._prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return UserMapper.toDomain(d);
  }
}
