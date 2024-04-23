import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  test() {
    return 'test';
  }
}
