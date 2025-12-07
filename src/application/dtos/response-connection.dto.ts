import { IsString } from "class-validator";

export class ResponseConnectionDto {
    @IsString()
    id:string

    @IsString()
    senderId:string

    @IsString()
    receieverId:string

    status:string
}