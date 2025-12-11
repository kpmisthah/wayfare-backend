export interface IConversationUsecase {
  execute(userA: string, userB: string): Promise<string>;
  getConversation(userId: string): Promise<
    {
      conversationId: string;
      lastMessage: string;
      lastMessageTime: Date;
      unreadCount: number;
      otherUser: { name: string | null; image: string | null; id: string };
    }[]
  >;
}
