import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PgBoss = require('pg-boss');
import { getEnv } from '../config/env';

@Injectable()
export class JobsService implements OnModuleInit, OnModuleDestroy {
  private boss: PgBoss | null = null;
  private readonly logger = new Logger(JobsService.name);
  private ready = false;

  async onModuleInit() {
    const env = getEnv();
    if (!env.JOBS_ENABLED) {
      this.logger.warn('Background jobs are disabled via JOBS_ENABLED=false');
      return;
    }
    try {
      this.boss = new PgBoss(env.DATABASE_URL);
      await this.boss.start();
      this.ready = true;
      this.logger.log('pg-boss started');
    } catch (error) {
      this.ready = false;
      this.logger.error(`pg-boss failed to start: ${String(error)}`);
      if (env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    if (this.boss) {
      await this.boss.stop();
      this.ready = false;
    }
  }

  async send(name: string, data: Record<string, unknown>) {
    if (this.boss) return this.boss.send(name, data);
    return null;
  }

  isReady() {
    return this.ready;
  }
}
