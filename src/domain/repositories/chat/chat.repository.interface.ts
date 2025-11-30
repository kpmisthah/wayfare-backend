import { MessageEntity } from "src/domain/entities/message.entity";
import { IBaseRepository } from "../base.repository";

export interface IChatRepository extends IBaseRepository<MessageEntity>{
    getMessagesByConversation(conversationId: string): Promise<MessageEntity[]>;
    createChat(message:MessageEntity):Promise<MessageEntity>
    createGroup(data: {
    name: string;
    avatar?: string;
    creatorId: string;
    members: { userId: string; role: 'ADMIN' | 'MEMBER' }[];
  }) 
  isUserInGroup(userId: string, groupId: string): Promise<boolean>
  getUserGroups(userId: string)
  getGroupById(groupId: string)
  getMessagesByGroup(groupId: string): Promise<MessageEntity[]>
    
}