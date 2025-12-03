import { IsString } from 'class-validator';

export class ConnectionDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  type: string;
  status: string;
  profileImage: string;
}
