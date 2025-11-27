import { Message, Prisma } from '@prisma/client';
import { MessageEntity } from 'src/domain/entities/message.entity';

export class MessageMapper {
  static toDomain(message: Message): MessageEntity {
    return new MessageEntity(
      message.id,
      message.senderId,
      message.content,
      message.conversationId,
      message.groupId,
      message.createdAt as unknown as string,
    );
  }
  // static toPrisma(messageEntity:MessageEntity):Prisma.MessageCreateInput{
  //     return{
  //         content:messageEntity.content,
  //         sender:{connect:{id:messageEntity.senderId}},
  //         conversation:{connect:{id:messageEntity.conversationId}}
  //     }
  // }
  static toPrisma(entity: MessageEntity): Prisma.MessageCreateInput {
    const data: Prisma.MessageCreateInput = {
      content: entity.content,
      sender: { connect: { id: entity.senderId } },
    };

    // Connect conversation only for direct messages
    if (entity.conversationId) {
      data.conversation = { connect: { id: entity.conversationId } };
    }

    // Connect group only for group messages
    if (entity.groupId) {
      data.group = { connect: { id: entity.groupId } };
    }

    return data;
  }
  static toDomains(messages: Message[]): MessageEntity[] {
    return messages.map((msg) => {
      return this.toDomain(msg);
    });
  }
}
