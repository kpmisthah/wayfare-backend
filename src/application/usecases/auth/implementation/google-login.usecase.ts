import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user/user.repository.interface';
import { UserEntity } from 'src/domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/domain/enums/role.enum';
import { JwtTokenFactory } from './jwt-token.factory';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly _jwtFactory: JwtTokenFactory,
  ) {}

  async execute(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    let user = await this._userRepository.findByEmail(googleUser.email);

    if (!user) {
      const name = `${googleUser.firstName} ${googleUser.lastName}`.trim();

      const newUser = UserEntity.create({
        name,
        email: googleUser.email,
        password: '', 
        phone: '',
        role: Role.User, 
        isVerified: false,
      });

      user = await this._userRepository.create(newUser);
    }
    if(!user) throw new Error("No user")
    const tokens = await this._jwtFactory.generateTokens(
        user.id,
        user.name,
        user.role
    )
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      accessToken:tokens.accessToken,
      refreshToken:tokens.refreshToken
    };
  }
}
