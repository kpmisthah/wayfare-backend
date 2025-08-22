import { Type } from "class-transformer"
import { IsArray, isArray, IsString, ValidateNested } from "class-validator"
import { itineraryDto } from "./create-itenerary.dto"
import { PackageStatus } from "src/domain/enums/package-status.enum"

export class PackageDto {
    @IsString()
    title:string
    @IsString()
    destination:string
    @IsString()
    description:string
    @IsString()
    highlights:string
    @IsString()
    duration:string
    picture:string[]
    price:string
    day:string
    activities:string
    meals:string
    accommodation:string
    status:PackageStatus
}
