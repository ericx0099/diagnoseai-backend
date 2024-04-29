import { AuthService } from 'src/middleware/auth/auth.service';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import {
  User,
  UserDocument,
  UsersSchema,
} from 'src/modules/users/schema/users.schema';
import { model, Model } from 'mongoose';
import { UsersModule } from 'src/modules/users/users.module';

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<any> => {
    const authService = new AuthService();
    const request = ctx.switchToHttp().getRequest();
    const session = authService.getSession(request);


    return session;
  },
);
