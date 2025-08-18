
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import { SafeUser } from 'src/application/dtos/safe-user.dto';
import { UserEntity } from 'src/domain/entities/user.entity';
export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(userEntity:UserEntity): Promise<UserEntity|null>;
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: SafeUser[] | null;
    page: number;
    total: number;
    totalPages: number;
  }>;

  findById(id: string): Promise<UserEntity | null>;
  update(id: string, updateUser:UserEntity): Promise<UserEntity> 
  remove(userStatus:UserEntity): Promise<UserEntity|null>
  updateRefreshToken(userId: string, refreshToken: string): Promise<UserEntity>;
}
