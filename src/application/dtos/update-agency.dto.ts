import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AgencyStatus } from 'src/domain/enums/agency-status.enum';

export class UpdateAgencyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsEnum(AgencyStatus)
    status?: AgencyStatus;
}
