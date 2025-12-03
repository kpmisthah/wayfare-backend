import { MessageDto } from 'src/application/dtos/message.dto';
import { MessageEntity } from 'src/domain/entities/message.entity';

export class MessageMapper {
  static toMessageDto(message: MessageEntity): MessageDto {
    return {
      id: message.id,
      content: message.content,
      conversationId: message.conversationId ?? null,
      groupId: message.groupId ?? null,
      senderId: message.senderId,
      createdAt: message.createdAt ?? '',
    };
  }

  static toMessageDtos(messages: MessageEntity[]): MessageDto[] {
    return messages.map((message) => {
      return this.toMessageDto(message);
    });
  }
}
