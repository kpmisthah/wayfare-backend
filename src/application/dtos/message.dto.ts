import { IsString } from "class-validator";

export class MessageDto {
    @IsString()
    id:string
    @IsString()
    content:string
    @IsString()
    conversationId:string
    @IsString()
    senderId:string
    @IsString()
    createdAt:string
}