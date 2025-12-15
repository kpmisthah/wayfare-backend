import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../../../domain/enums/role.enum';
import { JwtTokenFactory } from './jwt-token.factory';
import { IGoogleLoginUseCase } from '../interfaces/google-login.usecase.interface';

@Injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
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
    if (!user) throw new Error('No user');
    const tokens = await this._jwtFactory.generateTokens(
      user.id,
      user.name,
      user.role,
    );
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
