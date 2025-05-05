import clerkClient from '@clerk/clerk-sdk-node';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { extractToken } from '../utils/token.util';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('AuthGuard');
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();
    const token = extractToken(req);
    if (!token) {
      this.logger.warn('No token found');
      return false;
    }

    try {
      const payload = await clerkClient.verifyToken(token, {});
      this.logger.log(`Token payload: ${JSON.stringify(payload)}`);
      const userId = payload.userId || payload.sub;
      if (!userId) {
        this.logger.warn('No userId in token payload');
        return false;
      }
      const user = await .getUser(userId);
      if (!user) {
        this.logger.warn(`User not found: ${userId}`);
        return false;
      }
      req.user = {id: payload.sub, email: payload.email, username: payload.username }; "role: payload.publicMetadata.role"
      return true;
    } catch (err) {
      this.logger.error('Auth error', err);
      return false;
    }
  }
}