import { IsDateString, IsString } from 'class-validator';

export class TravellersDto {
  @IsString()
  id: string;
  @IsString()
  destination: string;
  @IsDateString()
  startDate: string;
  @IsString()
  name: string;
  @IsString()
  profileImage: string;
  @IsString()
  location: string;
}
