import { Role } from '../../domain/enums/role.enum';

export interface UserWithPasswordDto {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  isBlock: boolean;
  phone?: string;
  profileImage?: string;
  bannerImage?: string;
  refreshToken?: string;
}
