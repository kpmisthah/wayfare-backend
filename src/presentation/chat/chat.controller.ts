import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { IChatUsecase } from "src/application/usecases/chat/interfaces/message.interface";

@Controller('messages')
export class MessageController {
  constructor(
    @Inject('IChatUsecase')
    private readonly _chatUsecase:IChatUsecase
  ){}
  @Get(':conversationId')
  async getMessages(
    @Param('conversationId') conversationId:string,
    // @Query("take") take='50000',
    // @Query("skip") skip='0'
  ){
    // const t = Number(take)
    // const s = Number(skip)
    return await this._chatUsecase.getMessages(conversationId)
  }
}