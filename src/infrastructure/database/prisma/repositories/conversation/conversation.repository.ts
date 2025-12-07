import { Injectable } from '@nestjs/common';
import { IConversationRepository } from 'src/domain/repositories/conversation/conversation.repository.interface';
import { PrismaService } from '../../prisma.service';
import { ConversationEntity } from 'src/domain/entities/conversation.entity';
import { ConversationMapper } from 'src/infrastructure/mappers/coversation.mapper';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async createConversation(userIds: string[]): Promise<ConversationEntity> {
    const conversation = await this._prisma.conversation.create({
      data: {
        participants: {
          create: userIds.map((id) => ({ userId: id })),
        },
      },
    });
    console.log(conversation,'conersation in conversationr repo')
    return new ConversationEntity(
      conversation.id,
      userIds,
      conversation.createdAt,
    );
  }

  async findConversationBetween(
    userA: string,
    userB: string,
  ): Promise<ConversationEntity | null> {
    const conversation = await this._prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: userA } } },
          { participants: { some: { userId: userB } } },
        ],
      },
      include: { participants: true },
    });
    if (!conversation) return null;
    return ConversationMapper.toDomain(conversation);
  }
  async getUserConversations(
    userId: string,
  ): Promise<ConversationEntity[] | null> {
    const conversations = await this._prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: { participants: true },
    });
    // if (conversations) return null;
    return ConversationMapper.toDomains(conversations);
  }
}
