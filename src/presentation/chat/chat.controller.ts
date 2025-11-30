import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupChatDto } from 'src/application/dtos/group-chat.dto';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { IChatUsecase } from 'src/application/usecases/chat/interfaces/message.interface';
import { ISendConnection } from 'src/application/usecases/connection/interfaces/send-connection.interface';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';
import { ChatGateway } from './chat.gateway';

@Controller('messages')
@UseGuards(AccessTokenGuard)
export class MessageController {
  constructor(
    @Inject('IChatUsecase')
    private readonly _chatUsecase: IChatUsecase,
    @Inject('ISendConnectionUseCase')
    private readonly _connectionUsecase: ISendConnection,
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
    console.log(result,'===========>in creatrion group======================<')
    return result;
  }
  @Get('/groups')
  async getUserGroups(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this._chatUsecase.getUserGroups(userId);
  }
  // message.controller.ts
  @Get('chats')
  @UseGuards(AccessTokenGuard)
  async getUserChats(@Req() req: RequestWithUser) {
    const userId = req.user.userId;

    // Get direct connections
    const directChats =
      await this._connectionUsecase.getAcceptedConnections(userId);

    // Get groups
    const groups = await this._chatUsecase.getUserGroups(userId);
    console.log(groups,'grpupssssss')
    // Format groups properly
    const formattedGroups = groups.map((g) => ({
      groupId: g.id,
      conversationId: null,
      name: g.name,
      avatar: g.avatar || null,
      members: g.members.map((m) => m.userId),
      type:g.type,
      creatorId: g.creatorId,
      createdAt: g.createdAt,
    }));

    return [...directChats, ...formattedGroups];
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
    if(isGroup){
      console.log(isGroup,'=========isGroup=========...')
      return this._chatUsecase.getGroupMessages(conversationId);
    }else{
      return await this._chatUsecase.getMessages(conversationId);
    }
    
  }
  // Controller
}
