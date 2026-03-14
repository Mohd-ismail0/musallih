import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      const message =
        'Failed to connect to PostgreSQL. Ensure Docker Desktop/local PostgreSQL is running, verify DATABASE_URL in .env, and if credentials changed run: `npm run db:reset`.';
      throw new Error(`${message}\nOriginal error: ${String(error)}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
