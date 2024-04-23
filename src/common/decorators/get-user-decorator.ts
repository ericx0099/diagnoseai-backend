import { AuthService } from 'src/auth/auth.service';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const authService = new AuthService();
    const request = ctx.switchToHttp().getRequest();
    return authService.getSession(request);
  },
);
