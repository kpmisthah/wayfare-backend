import { GroupChatDto } from "src/application/dtos/group-chat.dto"
import { MessageDto } from "src/application/dtos/message.dto"

export interface IChatUsecase {
    saveMessages(conversationId:string,senderId:string,content:string):Promise<MessageDto|null>
    getMessages(conversationId:string)
    createGroup(creatorId: string, dto: GroupChatDto)
    saveGroupMessage(groupId: string,senderId: string,content: string): Promise<MessageDto>
    getUserGroups(userId: string)
    isGroupId(id: string): Promise<boolean>
    getGroupMessages(groupId: string): Promise<MessageDto[]>
}