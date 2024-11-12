import HTTP_STATUS from 'http-status-codes';
import { CustomError } from './CustomError';

export class InternalServerError extends CustomError {
    
  statusCode!:number;
  status!:string;  

  constructor(message: string) {
    super(message || "There was a server error, not your fault, we're on it");
    this.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
    this.status = "ERROR:INTERNAL_SERVER_ERROR"
  }
}