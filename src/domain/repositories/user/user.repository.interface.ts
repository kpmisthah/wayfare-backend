import { UserEntity } from 'src/domain/entities/user.entity';
import { IBaseRepository } from '../base.repository';
export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(userEntity: UserEntity): Promise<UserEntity | null>;
  findAll(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<{
    data: UserEntity[] | null;
    page?: number;
    total?: number;
    totalPages?: number;
  }>;

  findById(id: string): Promise<UserEntity | null>;
  update(id: string, updateUser: UserEntity): Promise<UserEntity>;
  updateStatus(id: string, isBlock: boolean): Promise<UserEntity | null>;
  remove(userStatus: UserEntity): Promise<UserEntity | null>;
  updateRefreshToken(userId: string, refreshToken: string): Promise<UserEntity>;
  findAllAgencies(): Promise<UserEntity[] | null>;
  listUsersFromAgencies(): Promise<UserEntity[] | null>;
  countAll(): Promise<number>;
  findEmail(email:string):Promise<UserEntity|null>
}
