// cors-logger.middleware.ts

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class CorsLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      if (res.statusCode === 403 || res.statusCode === 405) {
        Logger.debug(
          `CORS Error: ${req.method} ${req.url} from ${req.headers.origin}`,
        );
      }
    });
    next();
  }
}
