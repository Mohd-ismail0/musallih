import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import PgBoss from 'pg-boss';

@Injectable()
export class JobsService implements OnModuleInit, OnModuleDestroy {
  private boss: PgBoss | null = null;

  async onModuleInit() {
    const url = process.env.DATABASE_URL;
    if (!url) return;
    this.boss = new PgBoss(url);
    await this.boss.start();
  }

  async onModuleDestroy() {
    if (this.boss) await this.boss.stop();
  }

  async send(name: string, data: Record<string, unknown>) {
    if (this.boss) return this.boss.send(name, data);
    return null;
  }
}
