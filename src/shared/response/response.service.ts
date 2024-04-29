import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  createResponse<T>(data: T=undefined, success = false, message = 'global:fail') {
    return {
      success,
      message,
      data,
    };
  }
}
