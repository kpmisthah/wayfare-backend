import { Inject, Injectable } from "@nestjs/common";
import { MessageEntity } from "src/domain/entities/message.entity";
import { IChatRepository } from "src/domain/repositories/chat/chat.repository.interface";
import { IChatUsecase } from "../interfaces/message.interface";
import { MessageMapper } from "../../mapper/message.mapper";
import { MessageDto } from "src/application/dtos/message.dto";

@Injectable()
export class ChatUsecase implements IChatUsecase{
  constructor(
    @Inject('IMessageRepository')
    private readonly _chatRepo:IChatRepository
  ){}
  async saveMessages(conversationId:string,senderId:string,content:string):Promise<MessageDto|null>{
    const messageEntity = MessageEntity.create({
      conversationId,
      senderId,
      content,
    })
    console.log(conversationId,'in message app')
    console.log(senderId,'sender id in message app');
    console.log(content,'in content in app');
    let chat = await this._chatRepo.createChat(messageEntity)
    console.log(chat,'chattter in app')
    if(!chat) return null
    return MessageMapper.toMessageDto(chat)
  }
  async getMessages(conversationId:string):Promise<MessageDto[]>{
    let messages = await this._chatRepo.getMessagesByConversation(conversationId)
    return MessageMapper.toMessageDtos(messages)
  }
}