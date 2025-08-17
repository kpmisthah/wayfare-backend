import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User, UserVerification } from '@prisma/client';
import { IAuthRepository } from 'src/domain/repositories/auth/auth.repository.interface';
import { UserVerificationEntity } from 'src/domain/entities/user-verification';
import { userVerificationMapper } from 'src/infrastructure/mappers/user.verification.mapper';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaService) {}

  async findByOtp(otp: string): Promise<UserVerificationEntity | null> {
    let record = await this.prisma.userVerification.findFirst({
      where: { otp },
    });
    if(!record) return null
    return userVerificationMapper.toDomain(record)
  }
  async deleteTempUser(id: string) {
    return this.prisma.userVerification.delete({ where: { id } });
  }
  async resetPassword(
    email: string,
    data: { password: string },
  ): Promise<UserEntity | null> {
    try {
      console.log(email,'email in reset password repo');
      console.log(data.password,'in password repo');
      
      let resetPassword = await this.prisma.user.update({
        where: { email },
        data,
      });
      return UserMapper.toDomain(resetPassword)
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async logout(userId){
    await this.prisma.user.update({
      where:{id:userId},
      data:{refreshToken:null}
    })
  }
}
