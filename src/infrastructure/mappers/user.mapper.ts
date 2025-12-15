import { User, $Enums } from '@prisma/client';
import { UserEntity } from '../../domain/entities/user.entity';
import { Role } from '../../domain/enums/role.enum';
export class UserMapper {
  static toDomain(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password ?? '',
      user.role as Role,
      user.isBlock,
      user.isVerified,
      user.lastSeen || null,
      user.phone,
      user.profileImage ?? '',
      user.bannerImage ?? '',
      user.refreshToken ?? '',
    );
  }

  static toPrisma(
    user: UserEntity,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    console.log(user, 'toPrisma saving');

    const saveTodb = {
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role as $Enums.Role,
      isBlock: user.isBlock,
      profileImage: user.profileImage,
      bannerImage: user.bannerImage,
      refreshToken: user.refreshToken,
      isVerified: user.isVerified,
      phone: user.phone,
      lastSeen: user.lastSeen || new Date(),
    };
    console.log(saveTodb, 'in prisma saveToDb');
    return saveTodb;
  }

  static toDomainMany(users: User[]): UserEntity[] {
    return users.map((user) => {
      return UserMapper.toDomain(user);
    });
  }
}
