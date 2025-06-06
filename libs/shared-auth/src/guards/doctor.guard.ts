import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DoctorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private readonly logger = new Logger('AdminGuard');
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    if (user.role !== 'DOCTOR') {
        this.logger.warn(`Access denied for user ${user.id} — not a doctor`);
        throw new ForbiddenException('Doctors only');
      }

    return true;
  }
}