import { ConversationEntity } from 'src/domain/entities/conversation.entity';

export interface IConversationRepository {
  createConversation(userIds: string[]): Promise<ConversationEntity>;
  findConversationBetween(
    userA: string,
    userB: string,
  ): Promise<ConversationEntity | null>;
  getUserConversations(userId: string): Promise<ConversationEntity[] | null>;
}
