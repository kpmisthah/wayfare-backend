import { MessageDto } from '../../dtos/message.dto';
import { MessageEntity } from '../../../domain/entities/message.entity';

export class MessageMapper {
  static toMessageDto(message: MessageEntity): MessageDto {
    const entityWithSender = message as any;

    return {
      id: message.id,
      content: message.content,
      conversationId: message.conversationId ?? null,
      groupId: message.groupId ?? null,
      senderId: message.senderId,
      senderName: entityWithSender.sender?.name ?? undefined,
      senderProfileImage: entityWithSender.sender?.profileImage ?? undefined,
      createdAt: message.createdAt ?? '',
    };
  }

  static toMessageDtos(messages: MessageEntity[]): MessageDto[] {
    return messages.map((message) => {
      return this.toMessageDto(message);
    });
  }
}
