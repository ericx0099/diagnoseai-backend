// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await this.authService.getSession(req);
      if (session) {
        const userD = await this.usersService.findUserByEmail(session.email);
        (req as any).user = userD; // Add user to the request if the session is valid
      } 
    } catch (error) {
      console.error('Error processing authentication:', error);
    }
    next(); // Continuar al siguiente middleware/controlador, con o sin usuario
  }
}
