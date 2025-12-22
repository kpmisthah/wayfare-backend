import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../dtos/create-user.dto';
import { SafeUser } from '../../../dtos/safe-user.dto';
import { UpdateUserDto } from '../../../dtos/update-user.dto';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { IUserUsecase } from '../interfaces/user.usecase.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserMapper } from '../../mapper/user.mapper';

@Injectable()
export class UserService implements IUserUsecase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
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

    const user = await this._userRepo.create(userEntity);

    if (!user) {
      throw new Error('User not found');
    }

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
      isBlock: updateUserDto.isBlock,
    });
    const user = await this._userRepo.update(id, userUpdate);
    if (!user) return null;
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

  async findByEmail(email: string) {
    const existingUser = await this._userRepo.findByEmail(email);
    if (!existingUser) {
      return null;
    }
    return UserMapper.toUserWithPasswordDto(existingUser);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this._userRepo.updateRefreshToken(userId, refreshToken);
  }
}
