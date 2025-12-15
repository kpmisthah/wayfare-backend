import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { IConversationUsecase } from '../../application/usecases/conversation/interfaces/conversation.interface';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';

@Controller('conversations')
@UseGuards(AccessTokenGuard)
export class ConversationController {
  constructor(
    @Inject('IConversationUseCase')
    private readonly _conversationUsecase: IConversationUsecase,
  ) {}
  @Get('create/:userA/:userB')
  async create(
    @Param('userA') userA: string,
    @Param('userB') userB: string,
  ): Promise<string> {
    const result = await this._conversationUsecase.execute(userA, userB);
    return result ?? '';
  }

  @Get(':userId')
  async getUserConversations(@Param('userId') userId: string): Promise<
    {
      conversationId: string;
      lastMessage: string;
      lastMessageTime: Date;
      unreadCount: number;
      otherUser: { name: string | null; image: string | null; id: string };
    }[]
  > {
    return await this._conversationUsecase.getConversation(userId);
  }
}
