import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class WalletTransferDto{
    @IsString()
    id:string
    @IsNumber()
    @Type(()=>Number)
    amount:number
    @IsString()
    transactionType:string
    @IsString()
    paymentStatus:string
    date:Date
}   