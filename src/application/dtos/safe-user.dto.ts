import { Role } from '../../domain/enums/role.enum';

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  isBlock: boolean;
  role: Role;
  isVerified: boolean;
  phone?: string;
  readonly refreshToken: string;
  profileImage?: string;
};
