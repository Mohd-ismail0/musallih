import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const path = req.url;
    const userId = req.user?.sub;
    const orgId = req.user?.org_id;
    const requestId = req.headers['x-request-id'] || req.id;

    return next.handle().pipe(
      tap(() => {
        this.audit
          .log({
            actorUserId: userId,
            action: `${method} ${path}`,
            organizationId: orgId,
            requestId,
          })
          .catch(() => {});
      }),
    );
  }
}
