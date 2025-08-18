import { Inject, Injectable, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/application/dtos/create-user.dto';
import { SafeUser } from 'src/application/dtos/safe-user.dto';
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import { IAgencyRepository } from 'src/domain/repositories/agency/agency.repository.interface';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { IUserService } from 'src/application/usecases/users/interfaces/user.service.interface';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserMapper } from '../../mapper/user.mapper';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IAgencyRepository')
    private readonly agencyRepo: IAgencyRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser | null> {
    let userEntity = UserEntity.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      refreshToken: createUserDto.refreshToken,
      isBlock: createUserDto.isBlock ?? false,
      role: createUserDto.role,
      isVerified: false
    })
    console.log(userEntity,'in user.service.ts');
    
    let user = await this.userRepo.create(userEntity);
    if(!user){
      throw new Error("User not found")
    }
    console.log(user,'in user service');
    
    return UserMapper.toSafeUserDto(user)
  }

  async findAllUserFromDb(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: SafeUser[] | null;
    page: number;
    total: number;
    totalPages: number;
  }> {
    const user = await this.userRepo.findAll(page, limit, search);
    return user;
  }

  async findById(id: string):Promise<SafeUser | null> {
      let user = await this.userRepo.findById(id);
      if(!user) return null
      return UserMapper.toSafeUserDto(user)
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUser | null> {
    // const user = await this.userRepo.update(id, updateUserDto);
    const updateUserEntity = await this.userRepo.findById(id)
    if(!updateUserEntity) return null
    let userUpdate = updateUserEntity.update({
      name:updateUserDto.name,
      email:updateUserDto.email,
      password:updateUserDto.password ?? ''
    })
    let user = await this.userRepo.update(id,userUpdate)
    return UserMapper.toSafeUserDto(user);
  }
  async remove(id: string, isBlock: boolean): Promise<SafeUser | null> {
    let existingUser = await this.userRepo.findById(id)
    if(!existingUser){
      return null
    }
    const userStatus = existingUser.updateUserStatus({isBlock})
    const persistedUser = await this.userRepo.remove(userStatus);
    if(!persistedUser){
      return null
    }
    return UserMapper.toSafeUserDto(persistedUser)
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    let existingUser = await this.userRepo.findByEmail(email);
    if(!existingUser){
      return null
    }
    return existingUser
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    this.userRepo.updateRefreshToken(userId, refreshToken);
  }
}
