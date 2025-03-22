import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserScope } from 'src/models/app';

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_ADMIN_KEY = 'isAdmin';
export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);

export const SCOPE_PROTECTED = 'scopeProtected';
export const IsScopeAllowed = (scopes: UserScope[]) =>
  SetMetadata(SCOPE_PROTECTED, scopes);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload;
      const userScope: UserScope = payload.scope;

      // Check if the route requires admin access
      const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      // If isAdmin is true, only allow ADMIN users
      if (isAdmin && userScope !== UserScope.ADMIN) {
        throw new UnauthorizedException('Admin access required');
      }

      // Proceed to scope-based permissions check
      const allowedScopes = this.reflector.get<UserScope[]>(
        SCOPE_PROTECTED,
        context.getHandler(),
      );

      if (allowedScopes && allowedScopes.length > 0) {
        const isAllowed = allowedScopes.includes(userScope);
        if (!isAllowed) {
          throw new UnauthorizedException('Insufficient permissions');
        }
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
