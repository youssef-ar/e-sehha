import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private readonly logger = new Logger('AdminGuard');
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    if (user.role !== 'admin') {
        this.logger.warn(`Access denied for user ${user.id} — not an admin`);
        throw new ForbiddenException('Admins only');
      }

    return true;
  }
}