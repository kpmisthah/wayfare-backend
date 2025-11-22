import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { BookingStatus } from "src/domain/enums/booking-status.enum";

export class ResponseBookingDto {
    @IsString()
    id:string;

    @IsString()
    customerName:string;

    status:BookingStatus;

    @IsString()
    email:string;

    @IsString()
    phone?:string;

    @IsNumber()
    @Type(()=>Number)
    totalPeople:number;

    @IsNumber()
    @Type(()=>Number)
    totalAmount:number;

    @IsString()
    destination:string

    travelDate:string
}