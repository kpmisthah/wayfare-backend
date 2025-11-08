import { CreateUserDto } from 'src/application/dtos/create-user.dto';
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import { SafeUser } from 'src/application/dtos/safe-user.dto';
import { UserEntity } from 'src/domain/entities/user.entity';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<SafeUser | null>;
  findAllUserFromDb(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: SafeUser[] | null;
    page?: number;
    total?: number;
    totalPages?: number;
  }>;
  findById(id: string): Promise<SafeUser | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUser | null>;
  remove(id: string, isBlock: boolean): Promise<SafeUser | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
}
