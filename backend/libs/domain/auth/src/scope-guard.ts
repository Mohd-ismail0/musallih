import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './types';

export const REQUIRED_SCOPES = 'required_scopes';

export function RequireScopes(...scopes: string[]) {
  return (target: object, key?: string | symbol, descriptor?: PropertyDescriptor) => {
    const scopesList = scopes;
    if (descriptor) {
      Reflect.defineMetadata(REQUIRED_SCOPES, scopesList, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(REQUIRED_SCOPES, scopesList, target);
    return target;
  };
}

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(REQUIRED_SCOPES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    const payload = request.user as JwtPayload | undefined;
    if (!payload || !payload.scopes) {
      throw new ForbiddenException('Missing or invalid token scopes');
    }
    const hasAll = required.every((s) => payload!.scopes.includes(s));
    if (!hasAll) {
      throw new ForbiddenException(`Required scopes: ${required.join(', ')}`);
    }
    return true;
  }
}
