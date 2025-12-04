import { StatusCode } from "src/domain/enums/status-code.enum";

export interface ResponseDto {
  code: StatusCode;
  message: string;
}