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
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

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
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;

      // Check if the user's scope is allowed
      const allowedScopes = this.reflector.get<UserScope[]>(
        SCOPE_PROTECTED,
        context.getHandler(),
      );

      if (allowedScopes) {
        const userScope: UserScope = payload.scope;
        const isAllowed = allowedScopes.includes(userScope);
        if (!isAllowed) {
          throw new UnauthorizedException('Insufficient permissions');
        }
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
