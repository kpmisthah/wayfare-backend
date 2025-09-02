import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { $Enums, User } from '@prisma/client';
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import * as argon2 from 'argon2';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { SafeUser } from 'src/application/dtos/safe-user.dto';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';
import { BaseRepository } from '../base.repository';
@Injectable()
export class UserRepository extends BaseRepository<UserEntity> implements IUserRepository{
  constructor(private readonly _prisma:PrismaService) {
    super(_prisma.user,UserMapper)
  }

  async findByEmail(email: string):Promise<UserEntity|null> {
    let user = await this._prisma.user.findUnique({ where: { email } });
    if(!user) return null
    return UserMapper.toDomain(user)
  }

  // async create(userEntity:UserEntity): Promise<UserEntity | null> {
  //    const user = await this.prisma.user.create({
  //     data: UserMapper.toPrisma(userEntity)
  //   });
  //   console.log(user,'in repo');
    
  //   return UserMapper.toDomain(user)
  // }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<{
    data: UserEntity[] | null;
    page?: number;
    total?: number;
    totalPages?: number;
  }> {
    let skip:number
    if(page && limit){
      skip = (page - 1) * limit;
    }else{
      skip = 0
      page = 0
      limit = 0
    }
    const data = await this._prisma.user.findMany({
      // where: {
      //   role: 'USER',
      //   ...(search && {
      //     OR: [
      //       { name: { contains: search, mode: 'insensitive' } },
      //       { email: { contains: search, mode: 'insensitive' } },
      //     ],
      //   }),
      // },
      // select: {
      //   id: true,
      //   name: true,
      //   email: true,
      //   role:true,
      //   isBlock: true,
      //   profileImage: true,
      // },
      // skip,
      // take: limit,
      // orderBy: {
      //   createdAt: 'desc',
      // },
    });

    console.log(data,'data');
    
    let allUser = UserMapper.toDomainMany(data)
    console.log(allUser,'allUser');
    
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
      data:allUser,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // async findById(id: string): Promise<UserEntity | null> {
  //   const user = await this.prisma.user.findUnique({ where: { id } });
  //   if(!user) return null
  //   return UserMapper.toDomain(user);
  // }

  // async update(id: string, updateUser:UserEntity): Promise<UserEntity> {
  //   const res = await this.prisma.user.update({
  //     where: { id },
  //     data: UserMapper.toPrisma(updateUser),
  //   });
  //   return UserMapper.toDomain(res);
  // }

  async remove(userStatus:UserEntity): Promise<UserEntity|null> {
    const updateStatus = await this._prisma.user.update({
      where: {id:userStatus.id},
      data: UserMapper.toPrisma(userStatus)
    });
    return UserMapper.toDomain(updateStatus)
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken, {
      parallelism: 2,
    });
    let updateRefreshToken = await this._prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
    return UserMapper.toDomain(updateRefreshToken)
  }
}
