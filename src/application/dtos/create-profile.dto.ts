import { IsArray, IsEmail, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  name?:string

  @IsEmail()
  email?:string

  password?:string

  @IsString()
  profile?: string;

  @IsString()
  banner?: string;

  @IsString()
  location?: string;

  @IsString()
  phone?: string;

  preferences:{id:string,name:string}[]
}
