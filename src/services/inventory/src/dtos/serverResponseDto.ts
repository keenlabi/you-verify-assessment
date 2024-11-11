import { CustomError } from "src/infrastructure/errors/CustomError";

// success-response.dto.ts
export class ServerSuccessResponseDto<T> {
  data: T;
  message: string;
  statusCode: number;

  constructor(data: T, message: string, statusCode: number = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class ServerErrorResponseDto {
  status:string;
  statusCode:number;
  message:string;

  constructor(error:CustomError) {
    this.status = error.status;
    this.statusCode = error.statusCode;
    this.message = error.message;
  }
}

// export interface ServerErrorResponseDto {
//   status:string;
//   statusCode:number;
//   message:string;
// }