import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserVerificationEntity } from 'src/domain/entities/user-verification';
import { IUserVerification } from 'src/domain/repositories/user/user-verification.repository.interface';
import { userVerificationMapper } from 'src/infrastructure/mappers/user.verification.mapper';
import { BaseRepository } from 'src/infrastructure/database/prisma/repositories/base.repository';
@Injectable()
export class UserVerificationRepository
  extends BaseRepository<UserVerificationEntity>
  implements IUserVerification
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.userVerification, userVerificationMapper);
  }

  // async create(userVerifyEntity:UserVerificationEntity): Promise<UserVerificationEntity> {
  //   const user = await  this.prisma.userVerification.create({
  //     data:userVerificationMapper.toPrisma(userVerifyEntity)
  // });
  // return userVerificationMapper.toDomain(user)
  // }

  async findEmail(email: string): Promise<UserVerificationEntity | null> {
    const userVerification = await this._prisma.userVerification.findUnique({
      where: { email },
    });
    if (!userVerification) {
      return null;
    }
    return userVerificationMapper.toDomain(userVerification);
  }

  async updateOtp(
    email: string,
    data: UserVerificationEntity,
  ): Promise<UserVerificationEntity> {
    const updateOtp = await this._prisma.userVerification.update({
      where: { email },
      data: userVerificationMapper.toPrisma(data),
    });
    return userVerificationMapper.toDomain(updateOtp);
  }
}
