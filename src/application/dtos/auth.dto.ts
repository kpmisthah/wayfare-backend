import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '../../domain/enums/role.enum';

// Password complexity regex:
// - At least 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PASSWORD_ERROR_MESSAGE =
  'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';

export class SignupDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_ERROR_MESSAGE })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsEnum(['USER', 'ADMIN', 'AGENCY'], { message: 'Invalid role' })
  role: 'USER' | 'ADMIN' | 'AGENCY';
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsOptional()
  refreshToken: string | null;

  @IsOptional()
  role: Role;
}
