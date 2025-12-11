import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as argon2 from 'argon2';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';
import { BaseRepository } from 'src/infrastructure/database/prisma/repositories/base.repository';
@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.user, UserMapper);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this._prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return UserMapper.toDomain(user);
  }
  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    data: UserEntity[] | null;
    page?: number;
    total?: number;
    totalPages?: number;
  }> {
    // let skip: number;
    // if (page && limit) {
    const skip = (page - 1) * limit;
    // } else {
    //   skip = 0;
    //   page = 0;
    //   limit = 0;
    // }
    const data = await this._prisma.user.findMany({
      where: {
        role: 'USER',
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(data, 'data');

    const allUser = UserMapper.toDomainMany(data);
    console.log(allUser, 'allUser');

    const total = await this._prisma.user.count({
      where: {
        role: 'USER',
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
    });
    return {
      data: allUser,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async remove(userStatus: UserEntity): Promise<UserEntity | null> {
    const updateStatus = await this._prisma.user.update({
      where: { id: userStatus.id },
      data: UserMapper.toPrisma(userStatus),
    });
    return UserMapper.toDomain(updateStatus);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken, {
      parallelism: 2,
    });
    const updateRefreshToken = await this._prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
    return UserMapper.toDomain(updateRefreshToken);
  }

  async findAllAgencies(): Promise<UserEntity[] | null> {
    const agencies = await this._prisma.user.findMany({
      where: { role: 'AGENCY' },
    });
    if (!agencies) return null;
    return UserMapper.toDomainMany(agencies);
  }

  async updateStatus(id: string, isBlock: boolean): Promise<UserEntity | null> {
    const user = await this._prisma.user.update({
      where: { id },
      data: { isBlock },
    });
    return UserMapper.toDomain(user);
  }

  async listUsersFromAgencies(): Promise<UserEntity[] | null> {
    const agencies = await this._prisma.user.findMany({
      where: { role: 'AGENCY', isBlock: false, isVerified: true },
    });
    if (!agencies) return null;
    return UserMapper.toDomainMany(agencies);
  }

  async countAll(): Promise<number> {
    return await this._prisma.user.count();
  }
  async findEmail(email: string): Promise<UserEntity | null> {
    const user = await this._prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return UserMapper.toDomain(user);
  }
}
