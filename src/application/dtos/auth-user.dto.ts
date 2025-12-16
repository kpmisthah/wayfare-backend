import { Role } from '../../domain/enums/role.enum';

export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isBlock: boolean;
  phone?: string;
  profileImage?: string;
  bannerImage?: string;
}
