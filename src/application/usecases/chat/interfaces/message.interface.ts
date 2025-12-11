import { GroupChatDto } from 'src/application/dtos/group-chat.dto';
import { MessageDto } from 'src/application/dtos/message.dto';

export interface UserGroup {
  id: string;
  name: string;
  avatar: string | null;
  creatorId: string;
  createdAt: Date;
  type: string;
  members: {
    user: {
      id: string;
      name: string;
      profileImage: string | null;
    };
    role: string;
  }[];
}

export interface IChatUsecase {
  saveMessages(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<MessageDto | null>;
  getMessages(conversationId: string): Promise<MessageDto[]>;
  createGroup(creatorId: string, dto: GroupChatDto): Promise<unknown>;
  saveGroupMessage(
    groupId: string,
    senderId: string,
    content: string,
  ): Promise<MessageDto>;
  getUserGroups(userId: string): Promise<UserGroup[]>;
  isGroupId(id: string): Promise<boolean>;
  getGroupMessages(groupId: string): Promise<MessageDto[]>;
  markChatAsRead(userId: string, chatId: string): Promise<void>;
  updateLastSeen(userId: string, date: Date): Promise<void>;
  getLastSeen(userId: string): Promise<Date | null>;
}
