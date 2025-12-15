import { Role } from '../../domain/enums/role.enum';

export interface GoogleLoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    profileImage?: string | null;
  };
  accessToken: string;
  refreshToken: string;
}
