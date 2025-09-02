import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
import { Role } from 'src/domain/enums/role.enum';

export class CreateAgencyDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  address:string

  @IsString()
  licenseNumber?:string

  @IsString()
  ownerName?:string

  @IsString()
  websiteUrl?:string
}
