import { MessageEntity } from 'src/domain/entities/message.entity';
import { IBaseRepository } from '../base.repository';
import { UserGroup } from 'src/application/usecases/chat/interfaces/message.interface';

// Interface for created group return value
interface CreatedGroup {
  id: string;
  name: string;
  avatar: string | null;
  creatorId: string;
  createdAt: Date;
  members: {
    user: {
      id: string;
      name: string;
      profileImage: string | null;
      userId?: string;
    };
    role: string;
    joinedAt: Date;
  }[];
}

// Interface for group data returned by getGroupById
interface GroupData {
  id: string;
  name: string;
  avatar: string | null;
  creatorId: string;
  createdAt: Date;
}

export interface IChatRepository extends IBaseRepository<MessageEntity> {
  getMessagesByConversation(conversationId: string): Promise<MessageEntity[]>;
  createChat(message: MessageEntity): Promise<MessageEntity>;
  createGroup(data: {
    name: string;
    avatar?: string;
    creatorId: string;
    members: { userId: string; role: 'ADMIN' | 'MEMBER' }[];
  }): Promise<CreatedGroup>;
  isUserInGroup(userId: string, groupId: string): Promise<boolean>;
  getUserGroups(userId: string): Promise<UserGroup[]>;
  getGroupById(groupId: string): Promise<GroupData | null>;
  getMessagesByGroup(groupId: string): Promise<MessageEntity[]>;
  incrementUnreadCount(conversationId: string, userId: string): Promise<void>;
  incrementUnreadCountForGroup(groupId: string, userId: string): Promise<void>;
  markChatAsRead(userId: string, chatId: string): Promise<void>;
  getGroupMembers(groupId: string): Promise<string[]>;
  getConversationParticipants(conversationId: string): Promise<string[]>;
  getLastMessageForConversation(
    conversationId: string,
  ): Promise<MessageEntity | null>;
  getUnreadCountForConversation(
    conversationId: string,
    userId: string,
  ): Promise<number>;
  getLastMessageForGroup(groupId: string): Promise<MessageEntity | null>;
  getUnreadCountForGroup(groupId: string, userId: string): Promise<number>;
  updateLastSeen(userId: string, date: Date): Promise<void>;
  getLastSeen(userId: string): Promise<Date | null>;
}
