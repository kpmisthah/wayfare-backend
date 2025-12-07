import { IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  id: string;
  @IsString()
  content: string;
  @IsString()
  @IsOptional()
  conversationId?: string | null;
  @IsString()
  @IsOptional()
  groupId?: string | null;

  @IsString()
  senderId: string;
  @IsString()
  createdAt: string;

  @IsString()
  @IsOptional()
  senderName?: string;

  @IsString()
  @IsOptional()
  senderProfileImage?: string;

  @IsString()
  @IsOptional()
  status?: 'sent' | 'delivered' | 'read';
}
