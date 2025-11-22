import { MessageEntity } from "src/domain/entities/message.entity";
import { IBaseRepository } from "../base.repository";

export interface IChatRepository extends IBaseRepository<MessageEntity>{
    getMessagesByConversation(conversationId: string): Promise<MessageEntity[]>;
    createChat(message:MessageEntity):Promise<MessageEntity>
}