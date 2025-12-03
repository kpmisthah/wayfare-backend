import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { IConversationUsecase } from 'src/application/usecases/conversation/interfaces/conversation.interface';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';

@Controller('conversations')
@UseGuards(AccessTokenGuard)
export class ConversationController {
  constructor(
    @Inject('IConversationUseCase')
    private readonly _conversationUsecase: IConversationUsecase,
  ) {}
  @Get('create/:userA/:userB')
  async create(@Param('userA') userA: string, @Param('userB') userB: string) {
    return await this._conversationUsecase.execute(userA, userB);
  }

  @Get(':userId')
  async getUserConversations(@Param('userId') userId: string) {
    return await this._conversationUsecase.getConversation(userId);
  }
}
