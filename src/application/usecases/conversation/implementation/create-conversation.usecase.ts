import { Inject, Injectable } from '@nestjs/common';
import { IConversationRepository } from 'src/domain/repositories/conversation/conversation.repository.interface';
import { IConversationUsecase } from '../interfaces/conversation.interface';

@Injectable()
export class ConversationUseCase implements IConversationUsecase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepo: IConversationRepository,
  ) {}

  async execute(userA: string, userB: string) {
    const existing = await this._conversationRepo.findConversationBetween(
      userA,
      userB,
    );
    console.log(existing,'exitsingggggggg');
    
    console.log(userA,'userrrAAAA');
    console.log(userB,'userBBBB');
    if (existing) return existing;
    let res = await this._conversationRepo.createConversation([userA, userB]);
    console.log(res,'in ===========>conversation enitty==========>');
    return res
  }

  async getConversation(userId: string) {
    return await this._conversationRepo.getUserConversations(userId);
  }
}
