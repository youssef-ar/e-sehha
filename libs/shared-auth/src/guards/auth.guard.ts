import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { extractToken } from '../utils/token.util';
import { verifyToken, createClerkClient } from '@clerk/backend';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('AuthGuard');
  private clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();
    const token = extractToken(req);
    if (!token) {
      this.logger.warn('No token found');
      return false;
    }
    try {
      this.logger.debug(process.env.CLERK_SECRET_KEY);
      this.logger.debug(process.cwd());
      const payload= await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      const typedPayload = payload as {
        sub: string;
        email?: string;
        username?: string;
        publicMetadata?: { role?: string };
      }; 

      const userId = typedPayload.sub;
      if (!userId) {
        this.logger.warn('No userId in token payload');
        return false;
      }

      const user = await this.clerkClient.users.getUser(userId);
      if (!user) {
        this.logger.warn(`User not found: ${userId}`);
        return false;
      }

      req.user = {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        username: user.username,
        role: user.publicMetadata?.role,
      };

      return true;
    } catch (err) {
      this.logger.error('Auth error', err);
      return false;
    }
  }
}
