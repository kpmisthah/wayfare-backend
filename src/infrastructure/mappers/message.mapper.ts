import { Message, Prisma } from "@prisma/client";
import { MessageEntity } from "src/domain/entities/message.entity";

export class MessageMapper {
    static toDomain(message:Message):MessageEntity{
        return new MessageEntity(
            message.id,
            message.conversationId,
            message.senderId,
            message.content,
            message.createdAt as unknown as string
        )
    }
    static toPrisma(messageEntity:MessageEntity):Prisma.MessageCreateInput{
        return{
            content:messageEntity.content,
            sender:{connect:{id:messageEntity.senderId}},
            conversation:{connect:{id:messageEntity.conversationId}}
        }
    }
    static toDomains(messages:Message[]):MessageEntity[]{
        return messages.map((msg)=>{
            return this.toDomain(msg)
        })
    }
}