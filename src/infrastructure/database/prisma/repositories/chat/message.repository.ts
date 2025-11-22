import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { BaseRepository } from "../base.repository";
import { MessageEntity } from "src/domain/entities/message.entity";
import { IChatRepository } from "src/domain/repositories/chat/chat.repository.interface";
import { MessageMapper } from "src/infrastructure/mappers/message.mapper";

@Injectable()
export class MessageRepository extends BaseRepository<MessageEntity> implements IChatRepository{
    constructor(private readonly _prisma:PrismaService){
        super(_prisma.message,MessageMapper)
    }
    async getMessagesByConversation(conversationId:string):Promise<MessageEntity[]>{
        const msgs = await this._prisma.message.findMany({
            where:{conversationId},
            orderBy:{createdAt:'asc'},
        })
        return MessageMapper.toDomains(msgs)
    }
    async createChat(message:MessageEntity):Promise<MessageEntity>{
        console.log(message,'messageeeee')
        const msg = await this._prisma.message.create({
            data:MessageMapper.toPrisma(message)
        })
        console.log(msg,'msgggg')
        return MessageMapper.toDomain(msg)
    }
}