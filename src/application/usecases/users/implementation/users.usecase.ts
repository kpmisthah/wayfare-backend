import { Inject, Injectable, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/application/dtos/create-user.dto';
import { SafeUser } from 'src/application/dtos/safe-user.dto';
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { IUserService } from 'src/application/usecases/users/interfaces/user.usecase.interface';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserMapper } from 'src/application/usecases/mapper/user.mapper';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    @Inject('IAgencyRepository')
    private readonly _agencyRepo: IAgencyRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser | null> {
    const userEntity = UserEntity.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      refreshToken: createUserDto.refreshToken,
      isBlock: createUserDto.isBlock ?? false,
      role: createUserDto.role,
      isVerified: false,
      phone: createUserDto.phone ?? '',
    });
    console.log(userEntity, 'in user.service.ts');

    const user = await this._userRepo.create(userEntity);
    console.log(user, 'in user service after create repo gooys');

    if (!user) {
      throw new Error('User not found');
    }
    console.log(user, 'in user service');

    return UserMapper.toSafeUserDto(user);
  }

  async findAllUserFromDb(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: SafeUser[] | null;
    page?: number;
    total?: number;
    totalPages?: number;
  }> {
    const user = await this._userRepo.findAll(page, limit, search);
    // return user;
    if (!user) {
      return {
        data: null,
        page,
        total: 0,
        totalPages: 0,
      };
    }
    return {
      data: user.data
        ? user.data.map((u) => UserMapper.toSafeUserDto(u))
        : null,
      page: user.page,
      total: user.total,
      totalPages: user.totalPages,
    };
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this._userRepo.findById(id);
    console.log(user, 'user frmo id');

    if (!user) return null;
    return UserMapper.toSafeUserDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SafeUser | null> {
    const updateUserEntity = await this._userRepo.findById(id);
    if (!updateUserEntity) return null;
    const userUpdate = updateUserEntity.update({
      name: updateUserDto.name,
      email: updateUserDto.email,
      password: updateUserDto.password,
      refreshToken: updateUserDto.refreshToken,
    });
    const user = await this._userRepo.update(id, userUpdate);
    return UserMapper.toSafeUserDto(user);
  }
  async remove(id: string, isBlock: boolean): Promise<SafeUser | null> {
    const existingUser = await this._userRepo.findById(id);
    if (!existingUser) {
      return null;
    }
    const userStatus = existingUser.updateUserStatus({ isBlock });
    const persistedUser = await this._userRepo.remove(userStatus);
    if (!persistedUser) {
      return null;
    }
    return UserMapper.toSafeUserDto(persistedUser);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const existingUser = await this._userRepo.findByEmail(email);
    if (!existingUser) {
      return null;
    }
    return existingUser;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this._userRepo.updateRefreshToken(userId, refreshToken);
  }
}
