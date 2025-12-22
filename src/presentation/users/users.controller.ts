import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Query,
  UseGuards,
  Inject,
  Patch,
} from '@nestjs/common';

import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { IUserUsecase } from '../../application/usecases/users/interfaces/user.usecase.interface';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../../domain/enums/role.enum';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.User)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUserService')
    private readonly _userService: IUserUsecase,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this._userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
  ) {
    return this._userService.findAllUserFromDb(+page, +limit, search);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this._userService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this._userService.update(id, updateUserDto);
  }
}
