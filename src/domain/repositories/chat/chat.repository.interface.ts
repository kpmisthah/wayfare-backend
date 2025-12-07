import { MessageEntity } from 'src/domain/entities/message.entity';
import { IBaseRepository } from '../base.repository';

export interface IChatRepository extends IBaseRepository<MessageEntity> {
  getMessagesByConversation(conversationId: string): Promise<MessageEntity[]>;
  createChat(message: MessageEntity): Promise<MessageEntity>;
  createGroup(data: {
    name: string;
    avatar?: string;
    creatorId: string;
    members: { userId: string; role: 'ADMIN' | 'MEMBER' }[];
  });
  isUserInGroup(userId: string, groupId: string): Promise<boolean>;
  getUserGroups(userId: string);
  getGroupById(groupId: string);
  getMessagesByGroup(groupId: string): Promise<MessageEntity[]>;
  incrementUnreadCount(conversationId: string, userId: string)
  incrementUnreadCountForGroup(groupId: string, userId: string)
  markChatAsRead(userId: string, chatId: string)
  getGroupMembers(groupId: string): Promise<string[]>
  getConversationParticipants(conversationId: string): Promise<string[]>
  getGroupMembers(groupId: string): Promise<string[]>
  getLastMessageForConversation(conversationId: string)
  getUnreadCountForConversation(conversationId: string, userId: string)
  getLastMessageForGroup(groupId: string)
  getUnreadCountForGroup(groupId: string, userId: string)
  updateLastSeen(userId: string, date: Date)
  getLastSeen(userId: string)
}
