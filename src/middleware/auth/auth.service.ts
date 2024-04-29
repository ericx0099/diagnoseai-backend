// src/auth/auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { registerUserDTO } from 'src/modules/users/dto/user.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  getSessionCookieKey(): string {
    return 'authorization';
  }

  getCookieByKey(req: Request, key: string): string | undefined {
    const { cookies, headers } = req;
    Logger.debug(headers);
    return cookies[key] ?? undefined;
  }

  getHeaderByKey(req: Request, key: string): string | string[] | undefined {
    const { headers } = req;
    if (headers[key]) {
      return headers[key];
    }
    return undefined;
  }

  getTokenFromAuthorization(authorization: string): string | undefined {
    const t = authorization.split(' ');
    if (t[1]) {
      return t[1];
    }
    return undefined;
  }

  getSession(req: Request): registerUserDTO {
    const token = this.getHeaderByKey(req, this.getSessionCookieKey());
    if (Array.isArray(token) || !token) {
      return undefined;
    }
    const cookie = this.getTokenFromAuthorization(token);
    if (!cookie) {
      return undefined;
    }

    try {
      const session = jwt.verify(cookie, process.env.NEXTAUTH_SECRET);
      return session;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}
