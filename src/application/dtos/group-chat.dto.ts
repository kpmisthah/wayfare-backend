import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class GroupChatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  memberIds: string[];
}
