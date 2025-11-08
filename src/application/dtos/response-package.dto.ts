import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { PackageStatus } from "src/domain/enums/package-status.enum";

export class ResponsePackageDto {
    @IsString()
    id:string
    @IsString()
    title:string
    @IsString()
    destination:string
    @IsNumber()
    @Type(()=>Number)
    duration:number
    status:PackageStatus
}