import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { PackageStatus } from "src/domain/enums/package-status.enum";

export class UpdatePackageDto {
    // @IsString()
    // id:string
    @IsString()
    title:string
    @IsString()
    destination:string
    @IsString()
    description:string
    highlights:string
    @IsNumber()
    @Type(()=>Number)
    duration:number
    picture:string[]
    // @IsString()
    @IsNumber()
    @Type(()=>Number)    
    price:number
    @IsString()
    vehicle:string
    @IsString()
    pickup_point:string
    @IsString()
    drop_point:string
    @IsString()
    details:string
    status:PackageStatus
}