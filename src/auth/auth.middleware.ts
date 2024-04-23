// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await this.authService.getSession(req);
      if (session) {
        (req as any).user = session; // Agregar usuario a la request si la sesión es válida
      }
    } catch (error) {
      console.error('Error processing authentication:', error);
    }
    next(); // Continuar al siguiente middleware/controlador, con o sin usuario
  }
}
