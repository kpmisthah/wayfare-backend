import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupChatDto } from 'src/application/dtos/group-chat.dto';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { IChatUsecase } from 'src/application/usecases/chat/interfaces/message.interface';
import {
  ISendConnection,
  AcceptedConnection,
} from 'src/application/usecases/connection/interfaces/send-connection.interface';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { ChatGateway } from './chat.gateway';
import { IChatRepository } from 'src/domain/repositories/chat/chat.repository.interface';

@Controller('messages')
@UseGuards(AccessTokenGuard)
export class MessageController {
  constructor(
    @Inject('IChatUsecase')
    private readonly _chatUsecase: IChatUsecase,
    @Inject('ISendConnectionUseCase')
    private readonly _connectionUsecase: ISendConnection,
    @Inject('IMessageRepository')
    private readonly _chatRepo: IChatRepository,
    private readonly _chatGateway: ChatGateway,
  ) {}

  @Post('/group/create')
  async createGroup(
    @Body() groupChatDto: GroupChatDto,
    @Req() req: RequestWithUser,
  ) {
    const creatorId = req.user['userId'];
    console.log(creatorId, 'creatorIddddd');
    const result = await this._chatUsecase.createGroup(creatorId, groupChatDto);
    console.log(
      result,
      '===========>in creatrion group======================<',
    );
    return result;
  }
  @Get('/groups')
  async getUserGroups(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return await this._chatUsecase.getUserGroups(userId);
  }
  // message.controller.ts
  @Get('chats')
  @UseGuards(AccessTokenGuard)
  async getUserChats(@Req() req: RequestWithUser) {
    const userId = req.user.userId;

    // Get direct connections
    const directChats =
      await this._connectionUsecase.getAcceptedConnections(userId);

    const formattedDirect = await Promise.all(
      directChats.map(async (c: AcceptedConnection) => {
        const lastMsg = c.conversationId
          ? await this._chatRepo.getLastMessageForConversation(c.conversationId)
          : null;
        const unread = c.conversationId
          ? await this._chatRepo.getUnreadCountForConversation(
              c.conversationId,
              userId,
            )
          : 0;
        const lastSeen = await this._chatUsecase.getLastSeen(c.userId);
        return {
          ...c,
          type: 'direct',
          lastMessage: lastMsg,
          unreadCount: unread,
          lastSeen: lastSeen ? lastSeen.toISOString() : null,
        };
      }),
    );

    // Get groups
    const groups = await this._chatUsecase.getUserGroups(userId);
    console.log(groups, 'grpupssssss');
    // Format groups properly
    const formattedGroups = groups.map((g) => ({
      groupId: g.id,
      conversationId: null,
      name: g.name,
      avatar: g.avatar || null,
      members: g.members.map((m) => m.user.id),
      type: g.type,
      creatorId: g.creatorId,
      createdAt: g.createdAt,
    }));

    const allChats = [...formattedDirect, ...formattedGroups];
    allChats.sort((a, b) => {
      const itemA = a as unknown as {
        lastMessage?: { createdAt: string };
        createdAt?: string;
      };
      const itemB = b as unknown as {
        lastMessage?: { createdAt: string };
        createdAt?: string;
      };
      const timeA = itemA.lastMessage?.createdAt || itemA.createdAt || '0';
      const timeB = itemB.lastMessage?.createdAt || itemB.createdAt || '0';
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
    return allChats;
  }
  @Get(':conversationId')
  async getMessages(
    @Param('conversationId') conversationId: string,
    // @Query("take") take='50000',
    // @Query("skip") skip='0'
  ) {
    // const t = Number(take)
    // const s = Number(skip)
    const isGroup = await this._chatUsecase.isGroupId(conversationId);
    if (isGroup) {
      console.log(isGroup, '=========isGroup=========...');
      return this._chatUsecase.getGroupMessages(conversationId);
    } else {
      return await this._chatUsecase.getMessages(conversationId);
    }
  }
  @Post(':chatId/read')
  async markAsRead(
    @Param('chatId') chatId: string,
    @Req() req: RequestWithUser,
  ) {
    await this._chatUsecase.markChatAsRead(req.user.userId, chatId);
    return { success: true };
  }
}
