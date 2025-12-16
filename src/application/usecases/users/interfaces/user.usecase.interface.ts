import { CreateUserDto } from '../../../dtos/create-user.dto';
import { UpdateUserDto } from '../../../dtos/update-user.dto';
import { SafeUser } from '../../../dtos/safe-user.dto';
import { UserWithPasswordDto } from '../../../dtos/user-with-password.dto';

export interface IUserUsecase {
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
  /**
   * Returns user with password for internal authentication.
   * This should ONLY be used for internal auth verification.
   */
  findByEmail(email: string): Promise<UserWithPasswordDto | null>;
  updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
}
