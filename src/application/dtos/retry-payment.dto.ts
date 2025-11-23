import { IsString } from "class-validator";

export class RetryPaymentDto {
    @IsString()
    bookingId:string;
    @IsString()
    success_url:string;
    @IsString()
    cancel_url:string
}