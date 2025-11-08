import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  address: string;

  @IsString()
  licenseNumber?: string;

  @IsString()
  ownerName?: string;

  @IsString()
  websiteUrl?: string;
}
