import { MessageDto } from "src/application/dtos/message.dto"

export interface IChatUsecase {
    saveMessages(conversationId:string,senderId:string,content:string):Promise<MessageDto|null>
    getMessages(conversationId:string)
}