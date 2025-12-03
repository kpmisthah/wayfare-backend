import { IsString } from 'class-validator';

export class ChangePassword {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
