import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from 'src/application/usecases/users/implementation/users.usecase';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
  ],
  exports: ['IUserService'],
})
export class UsersModule {}
