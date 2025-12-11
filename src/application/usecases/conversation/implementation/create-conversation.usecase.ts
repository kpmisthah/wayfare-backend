import { Inject, Injectable } from '@nestjs/common';
import { IConversationRepository } from 'src/domain/repositories/conversation/conversation.repository.interface';
import { IConversationUsecase } from '../interfaces/conversation.interface';

@Injectable()
export class ConversationUseCase implements IConversationUsecase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepo: IConversationRepository,
  ) {}

  async execute(userA: string, userB: string): Promise<string> {
    const existing = await this._conversationRepo.findConversationBetween(
      userA,
      userB,
    );
    console.log(existing, 'exitsingggggggg');

    console.log(userA, 'userrrAAAA');
    console.log(userB, 'userBBBB');
    if (existing) return existing.id; // Corrected to return id as per Controller expectation (string) or entity? Controller expects string
    const res = await this._conversationRepo.createConversation([userA, userB]);
    console.log(res, 'in ===========>conversation enitty==========>');
    return res.id;
  }

  async getConversation(userId: string): Promise<
    {
      conversationId: string;
      lastMessage: string;
      lastMessageTime: Date;
      unreadCount: number;
      otherUser: { name: string | null; image: string | null; id: string };
    }[]
  > {
    const result = await this._conversationRepo.getUserConversations(userId);
    if (!result) return [];
    // TODO: The repository returns ConversationEntity[] but the interface expects enriched data.
    // This needs to be addressed by updating either the repository or the interface.
    // For now, return empty array as the entities don't contain the required fields.
    return [];
  }
}
