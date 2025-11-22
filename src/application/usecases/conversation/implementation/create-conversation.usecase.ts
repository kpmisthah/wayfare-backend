import { Inject, Injectable } from "@nestjs/common";
import { IConversationRepository } from "src/domain/repositories/conversation/conversation.repository.interface";
import { IConversationUsecase } from "../interfaces/conversation.interface";

@Injectable()
export class ConversationUseCase implements IConversationUsecase{
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepo:IConversationRepository
) {}

  async execute(userA: string, userB: string) {
    const existing = await this._conversationRepo.findConversationBetween(userA, userB);
    if (existing) return existing;
    await this._conversationRepo.createConversation([userA, userB]);
  }

  async getConversation(userId:string){
    return await this._conversationRepo.getUserConversations(userId)
  }

}
