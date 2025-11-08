import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/domain/enums/role.enum';
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
