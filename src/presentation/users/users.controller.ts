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

import { CreateUserDto } from 'src/application/dtos/create-user.dto';
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import { IUserUsecase } from 'src/application/usecases/users/interfaces/user.usecase.interface';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { RolesGuard } from '../roles/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.User)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserUsecase,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
  ) {
    return this.userService.findAllUserFromDb(+page, +limit, search);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/find')
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto, 'update dto in controller');
    return this.userService.update(id, updateUserDto);
  }
}
