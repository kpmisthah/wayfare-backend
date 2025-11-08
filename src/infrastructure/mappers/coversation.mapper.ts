import { Conversation, Prisma, UserOnConversation } from "@prisma/client";
import { ConversationEntity } from "src/domain/entities/conversation.entity";

type ConversationWithParticipants = Conversation & { participants: UserOnConversation[] };
type ConversationWithParticipantsAndUser = Prisma.ConversationGetPayload<{
  include: {
    participants: {
      include: {
        user: true;
      };
    };
  };
}>;
export class ConversationMapper {
  static toDomain(conversation: ConversationWithParticipants): ConversationEntity {
    return new ConversationEntity(
      conversation.id,
      conversation.participants.map(p => p.userId),
      conversation.createdAt
    );
  }

  static toDomains(conversations:ConversationWithParticipants[]):ConversationEntity[]{
    return conversations.map((con)=>{
        return this.toDomain(con)
    })
  }
  static toListAcceptedConnection(conversation:ConversationWithParticipantsAndUser){
    return new ConversationEntity(
      conversation.id,
      conversation.participants.map(p=>p.userId),
      conversation.createdAt
    )
  }
}
