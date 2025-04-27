import { Request } from 'express';

export function extractToken(req: Request): string | null {
  const authHeader = req.headers['authorization'];

  // Check Bearer token first
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // Fallback to Clerk's __session cookie
  if (req.cookies && req.cookies['__session']) {
    return req.cookies['__session'];
  }

  return null;
}