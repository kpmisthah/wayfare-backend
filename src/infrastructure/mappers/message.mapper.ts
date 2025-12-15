import { Message, Prisma } from '@prisma/client';
import { MessageEntity } from '../../domain/entities/message.entity';

type MessageWithSender = Message & {
  sender?: {
    id: string;
    name: string;
    profileImage?: string | null;
  };
};

export class MessageMapper {
  static toDomain(message: MessageWithSender): MessageEntity {
    const entity = new MessageEntity(
      message.id,
      message.senderId,
      message.content,
      message.conversationId,
      message.groupId,
      message.createdAt as unknown as string,
    );

    // Add sender info if available
    if (message.sender) {
      (entity as any).sender = {
        id: message.sender.id,
        name: message.sender.name,
        profileImage: message.sender.profileImage,
      };
    }

    return entity;
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
  static toDomains(messages: MessageWithSender[]): MessageEntity[] {
    return messages.map((msg) => {
      return this.toDomain(msg);
    });
  }
}
