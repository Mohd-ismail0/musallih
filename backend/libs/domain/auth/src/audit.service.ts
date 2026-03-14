import { Injectable } from '@nestjs/common';

export interface AuditEntry {
  actorUserId?: string;
  action: string;
  targetUserId?: string;
  organizationId?: string;
  resourceType?: string;
  resourceId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  async log(entry: AuditEntry): Promise<void> {
    // TODO: persist to AccessLog table (Stage 4 schema)
    const line = JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString(),
    });
    console.log(`[AUDIT] ${line}`);
  }
}
