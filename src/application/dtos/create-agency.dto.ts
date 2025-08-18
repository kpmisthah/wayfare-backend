import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';
import { Role } from 'src/domain/enums/role.enum';

export class CreateAgencyDto {
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsEnum(AgencyStatus)
  status: AgencyStatus;

  @IsArray()
  specialization: string[];
  
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(Role)
  role: Role;

  @IsEmail()
  email:string

}
