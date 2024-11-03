import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class HasAuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = this.authService.getSession(req);
      if (session) {
        const userD = await this.usersService.findUserByEmail(session.email);
    
        (req as any).user = userD; // Add user to the request if the session is valid
        next(); // Continue to the next middleware/controller with the user
      } else {
        res.status(401).json({ success: false, message: "auth:not_logged", data: [] });
      }
    } catch (error) {
      console.error('Error processing authentication:', error);
      res.status(500).json({ success: false, message: "Internal Server Error", data: [] });
    }
  }
}
