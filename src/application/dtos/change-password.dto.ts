import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';


const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PASSWORD_ERROR_MESSAGE =
  'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';

export class ChangePassword {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_ERROR_MESSAGE })
  newPassword: string;
}
