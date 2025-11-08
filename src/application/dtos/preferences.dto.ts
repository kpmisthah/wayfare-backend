import { IsString } from 'class-validator';

export class PreferenceDto {
  @IsString()
  name: string;
}
