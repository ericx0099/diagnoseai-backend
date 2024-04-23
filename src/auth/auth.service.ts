// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  getSessionCookieKey(): string {
    return "next-auth.session-token";
  }

  getCookieByKey(req: any, key: string): string | undefined {
    const { cookies } = req;
    return cookies[key] ?? undefined;
  }

  async getSession(req: any): Promise<any> {
    const cookie = this.getCookieByKey(req, this.getSessionCookieKey());
    if (!cookie) {
      return undefined;
    }

    try {
      const session = jwt.verify(cookie, process.env.NEXTAUTH_SECRET);
      return session;
    } catch (err) {
      return undefined;
    }
  }
}
