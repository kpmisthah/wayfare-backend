import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class WalletDto{
    @IsString()
    id:string
    
    @IsString()
    userId:string
    
    @IsNumber()
    @Type(()=>Number)
    balance:number
}