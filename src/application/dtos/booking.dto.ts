import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsString } from "class-validator";


export class BookingDto {

    @IsString()
    packageId:string
    // @IsDateString()
    travelDate:string
    @IsNumber()
    @Type(()=>Number)
    peopleCount:number
    @Type(()=>Number)
    totalAmount:number
    @IsString()
    paymentType?:string

}