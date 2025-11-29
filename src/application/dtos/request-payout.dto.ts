import { IsOptional, IsString } from "class-validator";

export class BankDetailsDto{
  @IsString()
  @IsOptional()
  id:string

  @IsString()
  agencyId:string

  @IsString()
  accountHolderName:string

  @IsString()
  accountNumber:string

  @IsString()
  ifscCode:string

  @IsString()
  bankName:string
  
  @IsString()
  branch:string
}