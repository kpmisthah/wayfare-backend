import { IsString } from "class-validator";

export class itineraryDto{
    @IsString()
    day:string
    @IsString()
    activities:string
    @IsString()
    meals:string
    @IsString()
    accommodation:string
    
}