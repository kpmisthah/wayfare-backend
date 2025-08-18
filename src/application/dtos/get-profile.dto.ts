import { IsString } from "class-validator"

export class GetProfileDto {
    id:string

    @IsString()
    name:string

    @IsString()
    email:string

    @IsString()
    phone:string
    
    @IsString()
    location:string

    @IsString()
    profileImage:string

    @IsString()
    bannerImage:string
}