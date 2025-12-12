export interface MessageDto {
  id: string;
  content: string;
  conversationId: string | null;
  groupId: string | null;
  senderId: string;
  senderName?: string;
  senderProfileImage?: string;
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read';
}
