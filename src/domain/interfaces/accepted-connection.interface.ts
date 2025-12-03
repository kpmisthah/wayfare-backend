export interface AcceptedConnection {
  userId: string;
  name: string;
  profileImage: string | null;
  conversationId: string | null;
  type: string;
}
